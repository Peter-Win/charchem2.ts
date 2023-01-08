import { Rational } from "../../math/Rational";
import { ChemEquation } from "../ChemEquation";

describe("ChemEquation", () => {
  it("Invalid expression", () => {
    const eq = new ChemEquation();
    eq.initBySrc("M + HCl = MCl + H2");
    expect(eq.getMessage("ru")).toBe("Ошибочный элемент 'M' в позиции 1");
  });

  it("Abstract", () => {
    const eq = new ChemEquation();
    eq.initBySrc("Fe + O2 -> Fe'n'O'm'");
    expect(eq.getMessage("ru")).toBe(
      "Невозможно балансировать уравнение с абстрактными коэффициентами"
    );
  });

  it("No separating operation", () => {
    const eq = new ChemEquation();
    eq.initBySrc("H2 + O2");
    expect(eq.getMessage("ru")).toBe(
      "Требуется одна операция, разделяющая левую и правую часть уравнения"
    );
  });

  it("Too many separating operations", () => {
    const eq = new ChemEquation();
    eq.initBySrc("H2SO4 <=> H^+ + HSO4^- <=> 2H^+ + SO4^2-");
    expect(eq.getMessage("ru")).toBe(
      "Требуется одна операция, разделяющая левую и правую часть уравнения"
    );
  });
  it("Element expected in right part", () => {
    const eq = new ChemEquation();
    eq.initBySrc("H2 + O2 + Cl -> H2O");
    expect(eq.getMessage("ru")).toBe(
      "Отсутствует элемент Cl в правой части уравнения"
    );
  });
  it("Element expected in left part", () => {
    const eq = new ChemEquation();
    eq.initBySrc("H2 + O2 -> H2O + Cl");
    expect(eq.getMessage("ru")).toBe(
      "Отсутствует элемент Cl в левой части уравнения"
    );
  });
  it("Matrix", () => {
    const eq = new ChemEquation();
    eq.initBySrc("KMnO4 + KCl + H2SO4 = Cl2 + MnSO4 + K2SO4 + H2O");
    //      KMnO4 KCl H2SO4  Cl2 MnSO4 K2SO4 H2O
    //  K     1    1    0  :  0    0    -2    0
    //  Mn    1    0    0  :  0   -1     0    0
    //  O     4    0    4  :  0   -4    -4   -1
    //  Cl    0    1    0  : -2    0     0    0
    //  H     0    0    2  :  0    0     0   -2
    //  S     0    0    1  :  0   -1    -1    0
    expect(eq.getMessage("en")).toBe("Not solved");
    const MRows = eq.getMatrix().map((row) => row.join(" "));
    expect(MRows).toEqual([
      "1 1 0 0 0 -2 0",
      "1 0 0 0 -1 0 0",
      "4 0 4 0 -4 -4 -1",
      "0 1 0 -2 0 0 0",
      "0 0 2 0 0 0 -2",
      "0 0 1 0 -1 -1 0",
    ]);
  });

  // 3Na2S + 2KMnO4 + 4H2O → 2MnO2 + 6NaOH + 2KOH + 3S
  it("checkBalance", () => {
    const eq = new ChemEquation();
    eq.initBySrc("Na2S + KMnO4 + H2O -> MnO2 + NaOH + KOH + S");
    eq.K = [3, 2, 4, 2, 6, 2, 3].map((v) => new Rational(v));
    expect(eq.checkBalance()).toBe(true);
    eq.K[0]?.set(1);
    expect(eq.checkBalance()).toBe(false);
  });
  it("findRowForAction, onSimpleSolve", () => {
    // Простой и наиболее типичный случай, где в строке ровно два коэффициента с разными знаками
    const eq = new ChemEquation();
    eq.initBySrc("HCOOH + ClSO3H → H2SO4 + HCl + CO");
    //    HCOOH ClSO3H H2SO4 HCl CO
    // H    2     1     -2   -1   0
    // C    1     0      0    0  -1
    // O    2     3     -4    0  -1
    // Cl   0     1      0   -1   0
    // S    0     1      1    0   0
    expect(eq.getMatrixStr()).toEqual([
      "2 1 -2 -1 0",
      "1 0 0 0 -1",
      "2 3 -4 0 -1",
      "0 1 0 -1 0",
      "0 1 -1 0 0",
    ]);
    const res = eq.findRowForAction();
    expect(res).toEqual({ nRow: 1, nCols: [0, 4] });

    eq.onSimpleSolve(res.nRow, res.nCols![0], res.nCols![1]);
    // k=1, т.к. 1 углерод в левой и правой части
    // исходная колонка 4, целевая колонка 0
    expect(eq.getSolves()).toEqual([
      { dstCol: 0, refs: [{ srcCol: 4, k: { x: 1, y: 1 } }] },
    ]);
    // Удаляется строка #1, левый столбец обнуляется, правый += левый * 1
    expect(eq.getMatrixStr()).toEqual([
      "0 1 -2 -1 2",
      "0 3 -4 0 1",
      "0 1 0 -1 0",
      "0 1 -1 0 0",
    ]);
  });

  it("simple equation by steps", () => {
    const eq = new ChemEquation();
    eq.initBySrc("H2 + O2 = H2O");
    //   H2  O2  H2O
    // H 2   0    2
    // O 0   2    1
    expect(eq.getMatrixStr()).toEqual(["2 0 -2", "0 2 -1"]);
    const res = eq.findRowForAction();
    expect(res).toEqual({ nRow: 0, nCols: [0, 2] });
    eq.onSimpleSolve(res.nRow, res.nCols![0], res.nCols![1]);
    expect(eq.getSolves()).toEqual([
      { dstCol: 0, refs: [{ srcCol: 2, k: { x: 1, y: 1 } }] },
    ]);
    expect(eq.getMatrixStr()).toEqual(["0 2 -1"]);

    const res1 = eq.findRowForAction();
    expect(res1).toEqual({ nRow: 0, nCols: [1, 2] });
    eq.onSimpleSolve(res1.nRow, res1.nCols![0], res1.nCols![1]);
    expect(eq.getMatrixStr()).toEqual([]);
    expect(eq.getSolves()).toEqual([
      { dstCol: 1, refs: [{ srcCol: 2, k: { x: 1, y: 2 } }] },
      { dstCol: 0, refs: [{ srcCol: 2, k: { x: 1, y: 1 } }] },
    ]);

    const restNdx = eq.getUnknownIndices();
    expect(restNdx).toEqual([2]);

    eq.simpleSolve();
    expect(eq.getMessage()).toBe("");
    expect(eq.K.join(" ")).toBe("2 1 2");
  });

  it("solve simple equation", () => {
    const eq = new ChemEquation();
    eq.initBySrc("H2 + O2 = H2O");
    eq.solve();
    expect(eq.getMessage()).toBe("");
  });

  it("try2RowsUnit", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`H2O <=> H3O^+ + OH^-`);
    //   H2O H3O OH
    // H  2  -3  -1
    // O  1  -1  -1
    expect(eq.getMatrixStr()).toEqual(["2 -3 -1", "1 -1 -1"]);
    const res = eq.findRowForAction();
    expect(res).toEqual({ nRow: -1 });
    expect(eq.try2RowsUnit()).toBe(true);
    expect(eq.getSolves()).toEqual([
      {
        dstCol: 0,
        refs: [
          { k: { x: 3, y: 2 }, srcCol: 1 },
          { k: { x: 1, y: 2 }, srcCol: 2 },
        ],
      },
    ]);
    expect(eq.getMatrixStr()).toEqual(["0 1/2 -1/2"]);
  });

  it("solve with try2RowsUnit", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`H2O <=> H3O^+ + OH^-`);
    eq.solve();
    expect(eq.getMessage()).toBe("");
    expect(eq.K.join(" ")).toBe("2 1 1");
  });

  it("testKoeffs", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`SO2 + O3 -> SO3 + O2`);
    //   SO2 O3 SO3 O2
    // S  1  0  -1   0
    // O  2  3  -3  -2
    expect(eq.getMatrixStr()).toEqual(["1 0 -1 0", "2 3 -3 -2"]);
    expect(eq.findRowForAction()).toEqual({ nRow: 0, nCols: [0, 2] });
    eq.onSimpleSolve(0, 0, 2);
    // col2 = -3 + 2*1 = -1
    expect(eq.getMatrixStr()).toEqual(["0 3 -1 -2"]);
    expect(eq.findRowForAction()).toEqual({ nRow: -1 });

    expect(eq.try2RowsUnit()).toBe(false);
    const unknownIndexes = eq.getUnknownIndices();
    expect(unknownIndexes).toEqual([1, 2, 3]);
    expect(eq.testKoeffs(unknownIndexes, [1, 1, 1])).toBe(true);
    expect(eq.K.join(" ")).toBe("1 1 1 1");
  });

  it("searchKoeffs", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`6Na + 2O2 -> 2Na2O + Na2O2`);
    //    Na O2 Na2O Na2O2
    // Na  1  0  -2   -2
    // O   0  2  -1   -2
    expect(eq.getMatrixStr()).toEqual(["1 0 -2 -2", "0 2 -1 -2"]);
    expect(eq.getUnknownIndices()).toEqual([0, 1, 2, 3]);
    expect(eq.findRowForAction()).toEqual({ nRow: -1 });
    expect(eq.try2RowsUnit()).toBe(true);
    expect(eq.getMatrixStr()).toEqual(["1/2 -2 0 1"]);

    expect(eq.findRowForAction()).toEqual({ nRow: -1 });
    expect(eq.try2RowsUnit()).toBe(false);
    expect(eq.searchKoeffs()).toBe(true);
    expect(eq.K.join(" ")).toBe("6 2 2 1");
  });

  it("Solution by enumeration", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`Na + O2 -> Na2O + Na2O2`);
    eq.solve();
    expect(eq.getMessage()).toBe("");
    expect(eq.K.join(" ")).toBe("6 2 2 1");
    expect(eq.getExpr()?.src?.trim()).toBe(`6Na + 2O2 -> 2Na2O + Na2O2`);
    expect(eq.getExpr()?.getAgents()?.[0]?.n?.toString()).toBe("6");
  });

  it("Radicals", () => {
    const eq = new ChemEquation();
    eq.initBySrc("Si(OC2H5)4 → SiO2 + Et2O");
    eq.solve();
    expect(eq.getMessage()).toBe("");
    expect(eq.K.join(" ")).toBe("1 1 2");
    expect(eq.getExpr()?.src?.trim()).toBe("Si(OC2H5)4 → SiO2 + 2Et2O");
  });
});
