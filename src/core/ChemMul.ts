/* eslint-disable max-classes-per-file */
import { ChemObj } from "./ChemObj";
import { Visitor } from "./Visitor";
import { ChemK } from "./ChemK";
/**
 * В версиях до 1.1 включительно умножитель действует только начиная с символа умножения
 * Например, CuSO4*5H2O. Здесь один умножитель.
 * Проблема начинается, когда появляется коэффициент перед агентом.
 * Вот пример уравнения: https://ru.wikipedia.org/wiki/%D0%A1%D1%83%D0%BB%D1%8C%D1%84%D0%B0%D1%82_%D0%B6%D0%B5%D0%BB%D0%B5%D0%B7%D0%B0(III)-%D0%B0%D0%BC%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F
 * Fe2(SO4)3 + (NH4)2SO4 + 24H2O "0^oC"-> 2NH4Fe(SO4)2*12H2O"|v"
 * Здесь коэффициент 2 относится ко всему последнему агенту.
 * Проблема в том, что невозможно указать коэффициент для первого множителя.
 * Пример - формула ржавчины: https://de.wikipedia.org/wiki/Rost
 *  x FeᴵᴵO · y Fe₂ᴵᴵᴵO₃ · z H₂O
 * Таким образом, есть двусмысленность.
 * Что означает первый коэффициент: общий или только для первого множителя?
 * Принято решение, что первый коэффициент действует на весь агент.
 * А если нужно использовать коэффициент только для первого множителя, нужно использовать скобки
 * ('x'Fe(ii)O*'y'Fe(iii)2O3*'z'H2O)
 * Это значит, что внутри скобок может встречаться коэффициент.
 * Такая возможность появляется только начиная с версии 1.2!
 */

// Начало конструкции, умножающей последующее содержимое на указанный коэффициент
// Кроме того, является мостиком, т.е. образует новую подцепь
// example: CuSO4*5H2O
// isFirst для коэффициента, который стоит первым внутри скобок (2FeO*3H2O)
export class ChemMul extends ChemObj {
  constructor(
    public readonly n: ChemK,
    public readonly isFirst: boolean,
    public readonly color?: string
  ) {
    super();
  }

  override walk(visitor: Visitor) {
    visitor.mul?.(this);
  }
}

// Конец множителя.
// Не участвует в выводе.
// Предназначен для вычислительных алгоритмов, использующих стек, чтобы выполнить pop
export class ChemMulEnd extends ChemObj {
  constructor(public readonly begin: ChemMul) {
    super();
  }

  override walk(visitor: Visitor) {
    visitor.mulEnd?.(this);
  }
}
