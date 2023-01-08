import { Int } from "../types";
import { compile } from "../compiler/compile";
import { SrcMapItem } from "../compiler/sourceMap/SrcMapItem";
import { ChemAgent } from "../core/ChemAgent";
import { ChemExpr } from "../core/ChemExpr";
import { Lang, LangParams } from "../lang";
import { isSuitableForEquation } from "./isSuitableForEquation";
import { calcAbsMCD, Rational } from "../math/Rational";
import { ElemList } from "../core/ElemList";
import { makeElemList } from "../inspectors/makeElemList";
import { ifDef } from "../utils/ifDef";
import { equationDict } from "./equationDict";
import { ChemError } from "../core/ChemError";
import { checkElementsMatching } from "./checkElementsMatching";
import { makeCoeffEnumerator } from "./coeffEnumerators";
import { makeSourceWithNewCoeffs } from "./makeSourceWithNewCoeffs";

export type ChemEquationState = "NotSolved" | "Error" | "Solved";

let dictReady = false;

interface SolveRef {
  srcCol: Int;
  k: Rational;
}

interface SolveItem {
  dstCol: Int;
  refs: SolveRef[];
}
const newSolveItem = (dstCol: Int) => ({ dstCol, refs: [] });

export class ChemEquation {
  private state: ChemEquationState = "NotSolved";

  private msgId?: string;

  private params?: LangParams;

  private agents: ChemAgent[] = [];

  private expr?: ChemExpr;

  private nCols: number = 0;

  private M: Rational[][] = []; // Матрица линейных уравнений

  K: Rational[] = [];

  private solves: SolveItem[] = []; // Набор записей типа A = 2B + C

  private srcMap: SrcMapItem[] = [];

  constructor() {
    if (!dictReady) {
      Lang.addDict(equationDict);
      dictReady = true;
    }
    this.clear();
  }

  getSolves(): SolveItem[] {
    return this.solves;
  }

  getExpr(): ChemExpr | undefined {
    return this.expr;
  }

  protected setState(
    state: ChemEquationState,
    msgId?: string,
    params?: LangParams
  ): void {
    this.state = state;
    this.msgId = msgId ?? (state === "NotSolved" ? "Not solved" : undefined);
    this.params = params;
  }

  getMessage(langId?: string): string {
    return (
      ifDef(this.msgId, (msgId) => Lang.tr(msgId, this.params, langId)) ?? ""
    );
  }

  isSolved(): boolean {
    return this.state === "Solved";
  }

  makeError(): Error {
    return new ChemError(this.msgId || this.state, this.params);
  }

  clear() {
    this.setState("NotSolved");
    this.agents = [];
    this.expr = undefined;
    this.M = [];
    this.solves = [];
    this.srcMap = [];
  }

  initBySrc(formula: string): void {
    const expr = compile(formula, { srcMap: true });
    this.initByExpr(expr, expr.srcMap ?? []);
  }

  initByExpr(expr: ChemExpr, srcMap: SrcMapItem[]): void {
    this.clear();
    if (!expr) {
      return this.setState("Error", "Invalid expression");
    }
    const { error } = expr;
    if (error) {
      if (error instanceof ChemError) {
        return this.setState("Error", error.msgId, error.params);
      }
      return this.setState("Error", error.message);
    }
    this.expr = expr;
    this.srcMap = srcMap;

    const res = isSuitableForEquation(expr);
    if (res) {
      return this.setState("Error", res.msgId);
    }

    this.agents = expr.getAgents();

    const parts: ElemList[] = [];
    this.agents.forEach((agent) => {
      const { part } = agent;
      const list = parts[part] || new ElemList();
      list.addList(makeElemList(agent, true));
      parts[part] = list;
    });
    const leftPart = parts[0];
    const rightPart = parts[1];
    if (!leftPart || !rightPart || parts.length !== 2) {
      return this.setState("Error", "No separating operation");
    }
    const elemRes = checkElementsMatching([leftPart, rightPart]);
    if (elemRes) {
      return this.setState("Error", elemRes[0], elemRes[1]);
    }

    // Число колонок равно количеству агентов
    this.nCols = this.agents.length;
    this.K = this.agents.map(() => new Rational());
    // Количество строк матрицы равно числу элементов в уравнении
    this.M = leftPart.list.map(() => []);
    // Индексация элементов
    const elemIndex = leftPart.list.reduce(
      (acc, rec, i) => ({ ...acc, [rec.id]: i }),
      {} as Record<string, number>
    );

    this.agents.forEach((agent) => {
      // массив коэффициентов для столбца
      const col = this.M.map((row) => {
        const k = new Rational();
        row.push(k);
        return k;
      });
      // Получить список элементоа для агента
      const list = makeElemList(agent, true);
      list.list.forEach((rec) => {
        const c: number = rec.n * (agent.part === 1 ? -1 : 1);
        ifDef(elemIndex[rec.id], (index) => {
          ifDef(col[index], (k) => k.set(c));
        });
      });
    });
    return this.setState("NotSolved");
  }

  getMatrix(): Rational[][] {
    return this.M;
  }

  getMatrixStr(): string[] {
    return this.M.map((row) => row.join(" "));
  }

  //---------------------------------------------------------
  // Решение уравнения (вызов шагов до получения результата)
  solve() {
    while (this.state === "NotSolved") {
      this.calcStep();
    }
  }

  // Выполнение одного шага
  calcStep(): void {
    // Шаг может выполняться только в состоянии объекта-балансера, когда решение не найдено (и нет ошибок)
    if (this.state !== "NotSolved") return;
    // Если остался только один неизвестный коэффициент, уравнение можно считать решенным
    if (this.solves.length === this.nCols - 1) {
      this.simpleSolve();
      return;
    }
    const { nRow, nCols } = this.findRowForAction();
    if (nRow >= 0) {
      if (nCols) {
        this.onSimpleSolve(nRow, nCols[0], nCols[1]);
      } else {
        // Если найдена пустая строка, то удалить её
        this.deleteMatrixRow(nRow);
      }
      return;
    }
    // Другой вариант - попытаться объединить две строки
    if (this.try2RowsUnit()) return;

    // Если других вариантов нет - пробуем решить перебором
    if (!this.searchKoeffs()) {
      this.setState("Error", "Balance is not found");
    }
  }

  deleteMatrixRow(rowIndex: Int) {
    this.M.splice(rowIndex, 1);
  }

  // Найдено простое решение, когда один коэффициент выражается через другой
  onSimpleSolve(rowIndex: Int, k0Index: Int, k1Index: Int) {
    // Выразить один коэффициент через другой. Нр  2A - 3C = 0 =>  2A = 3C => A = 3/2C
    const srcRow = this.M[rowIndex]!;
    // Множитель, через который K[k0] выражается через K[k1]
    const k: Rational = srcRow[k1Index]!.negx().divi(srcRow[k0Index]!);
    // Отмечаем, что решение найдено для коэффициента агента #k0
    const solveItem: SolveItem = newSolveItem(k0Index);
    // И он равен коэффициенту агента #k1 с соотв. множителем
    solveItem.refs.push({ srcCol: k1Index, k });
    this.solves.unshift(solveItem);
    this.deleteMatrixRow(rowIndex);

    // Теперь нужно заменить в матрице все k0 на k1
    //   A + B = C + D    =>    A B -C -D
    //  3/2C + B = C + D  =>    0 B (3/2-1)C -D
    // То есть, M1 = M1 + M0*m
    // Затем M0 = 0
    this.M.forEach((row) => {
      row[k1Index]!.addi(row[k0Index]!.mulx(k));
      row[k0Index]!.set(0);
    });
  }

  findRowForAction(): { nRow: Int; nCols?: [Int, Int] } {
    let nCols: [Int, Int] | undefined;
    const nRow = this.M.findIndex((row) => {
      const filledNdx: Int[] = row.reduce(
        (acc, k, j) => (k.isZero() ? acc : [...acc, j]),
        [] as Int[]
      );
      if (filledNdx.length === 0) return true; // Пустая строка
      if (filledNdx.length === 2) {
        const col0: Int = filledNdx[0]!;
        const col1: Int = filledNdx[1]!;
        if (row[col0]?.sign() !== row[col1]?.sign()) {
          // строка, где ровно два коэффициента с разными знаками
          nCols = [col0, col1];
          return true;
        }
      }
      return false;
    });
    return { nRow, nCols };
  }

  // Решить уравнение, приняв последний коэффициент за 1
  // void IChemBalance::simpleSolve() {
  simpleSolve() {
    // обнуляем результирующие коэффициенты
    this.K.forEach((k) => k.set(0));

    // Берём оставшиеся неизвестные коэффициенты (обфычно один)
    const unknownIndexes = this.getUnknownIndices();

    // Заполняем их единицами
    unknownIndexes.forEach((i) => this.K[i]?.set(1));

    this.calcSolves();

    // Привести все коэффициенты к общему знаменателю
    this.optimizeKoeffs();

    // Проверки
    if (!this.checkKoeffs() || !this.checkBalance()) {
      this.setState("Error", "Balance is not found");
    } else {
      this.finalSolve();
    }
  }

  finalSolve() {
    // Переключить состояние на Решенное
    this.setState("Solved", "");

    // Заполнить коэффициенты агентов
    const { expr, K, agents, srcMap } = this;
    if (expr) {
      const numCoeffs = K.map(({ x }) => x);
      const newSrc = makeSourceWithNewCoeffs(
        numCoeffs,
        agents,
        expr.src,
        srcMap
      );
      this.expr = compile(newSrc, { srcMap: true });
    }
  }

  /**
   * Вернуть индексы неизвестных коэффициентов
   */
  getUnknownIndices(): Int[] {
    // вспомогательный массив, куда записываются найденны индексы. Значение 0 - соотв. ненайденному
    const found: Int[] = new Array(this.nCols);
    found.fill(0);
    const notFound: Int[] = [];
    this.solves.forEach((si) => {
      found[si.dstCol] = 1;
    });
    // Теперь собираем список ненайденных
    for (let j = 0; j !== this.nCols; j++) {
      if (!found[j]) notFound.push(j);
    }
    return notFound;
  }

  calcSolves() {
    // Теперь вычисляем найденные решения
    this.solves.forEach(({ dstCol, refs }) => {
      // выражение типа A = 2B + 3C
      this.K[dstCol]?.set(0);
      refs.forEach((ref) => {
        this.K[dstCol]?.addi(ref.k.mulx(this.K[ref.srcCol]!));
      });
    });
  }

  optimizeKoeffs() {
    // Ищем общий знаменатель
    const comm: Int = this.K.reduce((acc, { y: k }) => {
      const nod = calcAbsMCD(acc, k);
      return Math.max(acc, (acc * k) / nod);
    }, 1);
    // Теперь переходим к целым коэффициентам. на y больше не обращаем внимания.
    const ki: Int[] = this.K.map((r) => {
      const m = comm / r.y;
      return r.x * m;
    });
    let maxX: Int = ki.reduce((acc, it) => Math.max(acc, it), 0);

    // иногда возможна ситуация, когда все коэффициенты имеют общий делитель...
    // (возможно, алгоритм был бы эффективнее, если начинать об большего d и уменьшать до 2)
    let d = 2;
    /* eslint no-loop-func: "off" */
    while (d <= maxX) {
      // Пробуем разделить все коэффициенты на минимальный делитель d
      const inv = ki.findIndex((v) => v % d !== 0);
      if (inv >= 0) {
        // если хоть один из коэффициентов не разделился без остатка на d, переходим к сдедующему значению d
        d++;
        // eslint-disable-next-line no-continue
        continue;
      }
      // если все коэффициэнты делятся, делим их и maxX
      maxX /= d;
      ki.forEach((value, j) => {
        ki[j] = value / d;
      });
      // следующая итерация происходит с тем же d
    }
    // Заполнить полученными целыми значениями массив m_K
    this.K = ki.map((value) => new Rational(value));
  }

  // Проверка коэффициентов
  checkKoeffs(): boolean {
    return !this.K.find((k) => k.x <= 0);
  }

  // Проверка баланса
  checkBalance(): boolean {
    const balance: Record<string, Int> = {};
    this.agents.forEach((agent, j) => {
      makeElemList(agent, true).list.forEach(({ id, n }) => {
        let count = n;
        if (agent.part > 0) count = -count;
        count *= this.K[j]?.x ?? 0;
        if (!balance[id]) {
          balance[id] = count;
        } else {
          balance[id] += count;
        }
      });
    });
    // Теперь если есть хоть один ненулевой элемент, значит ошибка
    return Object.values(balance).findIndex((v) => v !== 0) < 0;
  }

  try2RowsUnit(): boolean {
    const { nCols, M } = this;
    const end = M.length;
    if (end < 2) {
      return false;
    }
    let it0: Int;
    let it1: Int;
    let colNdx: Int = 0;
    for (it0 = 0; ; ++it0) {
      it1 = it0 + 1; // Вторая строка следующая за первой
      if (it1 === end) {
        // Если конец матрицы, значит не нашлось подходящих для объединения строк
        return false;
      }
      const row0: Rational[] = this.M[it0]!;
      // Цикл: вторая строка смещается до конца матрицы
      for (; it1 !== end; ++it1) {
        const row1 = this.M[it1]!;
        for (colNdx = 0; colNdx !== nCols; colNdx++) {
          if (!row0[colNdx]?.isZero() && !row1[colNdx]?.isZero()) break;
        }
        if (colNdx !== nCols) break;
      }
      if (it1 !== end) break; // найдены две строки it0 и it1, которые объединяются по колонке colNdx
    }
    const row0 = M[it0]!;
    const row1 = M[it1]!;
    const mul0 = new Rational(-1).divi(row0[colNdx]!);
    const mul1 = new Rational(-1).divi(row1[colNdx]!);
    // Сформировать решение из первой строки
    // colNdx - индекс столбца, для которого формируется решение
    const sitem: SolveItem = newSolveItem(colNdx);
    row0.forEach((k, i) => {
      if (i !== colNdx && !k.isZero()) {
        // Добавляем слагаемое, если оно ненулевое
        sitem.refs.push({
          srcCol: i,
          k: k.mulx(mul0),
        });
      }
    });
    if (sitem.refs.length === 0)
      // Это значит, что в первой строке все остальные колонки, кроме j-й, пусты
      return false;
    this.solves.unshift(sitem);

    // Вторая строка комбинируется с первой по принципу row1[i] = row0[i]*mul0 + row1[i]*mul1
    // 2A -3B -4C   mul0=-1/2  A = 3/2B + 4/2C
    // 3A -2B -4D   mul1=-1/3  A = 2/3B + 4/3D => 11/6B + 2C + 4/3D
    for (let i = 0; i !== nCols; i++) {
      row1[i] = row0[i]!.mulx(mul0).subi(row1[i]!.mulx(mul1));
    }
    // Удаляем первую строку из матрицы
    this.deleteMatrixRow(it0);
    it1--;

    // Если в матрице остаётся более одной строки, значит нужно подставить только что высчитанный коэффициент
    this.M.forEach((row, it) => {
      if (it !== it1) {
        const k = row[colNdx]!.copy();
        row[colNdx]!.set(0);
        sitem.refs.forEach((ref) => row[ref.srcCol]!.addi(k.mulx(ref.k)));
      }
    });

    return true;
  }

  searchKoeffs(): boolean {
    const unknownIndices = this.getUnknownIndices();
    // N - количество переменных
    const N = unknownIndices.length;
    // MaxL - максимальное значение переменной
    const MaxL = 30;
    const gen = makeCoeffEnumerator(N, MaxL);
    if (gen) {
      for (const vars of gen) {
        if (this.testKoeffs(unknownIndices, vars)) {
          return true;
        }
      }
    }
    return false;
  }

  testKoeffs(unknownIndexes: Int[], variants: Int[]): boolean {
    unknownIndexes.forEach((uIndex, pos) => {
      this.K[uIndex]?.set(variants[pos]!);
    });
    this.calcSolves();
    if (!this.checkKoeffs()) return false;
    this.optimizeKoeffs();
    if (!this.checkBalance()) return false;
    this.finalSolve();
    return true;
  }
}
