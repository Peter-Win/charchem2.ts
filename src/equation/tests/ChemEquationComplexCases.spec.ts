import { ChemEquation } from "../ChemEquation";

describe("ChemEquationComplexCases", () => {
  it("2Bi(NO3)3 + 2Na2O2 + 4NaOH -> 2NaBiO3 + 6NaNO2 + 3O2 + 2H2O", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`2Bi(NO3)3 + 2Na2O2 + 4NaOH -> 2NaBiO3 + 6NaNO2 + 3O2 + 2H2O`);
    //       0       1    2        3     4    5   6
    //    Bi(NO3)3 Na2O2 NaOH = NaBiO3 NaNO2 O2 H2O
    // Bi    1       0    0       -1     0    0   0
    // N     3       0    0        0    -1    0   0
    // O     9       2    1       -3    -2   -2  -1
    // Na    0       2    1       -1    -1    0   0
    // H     0       0    1        0     0    0  -2
    //      =2      =2   =4       =2    =6   =3  =2
    expect(eq.getMatrixStr()).toEqual([
      "1 0 0 -1 0 0 0",
      "3 0 0 0 -1 0 0",
      "9 2 1 -3 -2 -2 -1",
      "0 2 1 -1 -1 0 0",
      "0 0 1 0 0 0 -2",
    ]);
    expect(eq.findRowForAction()).toEqual({ nRow: 0, nCols: [0, 3] });
    eq.onSimpleSolve(0, 0, 3);
    expect(eq.getSolves()).toEqual([
      { dstCol: 0, refs: [{ srcCol: 3, k: { x: 1, y: 1 } }] },
    ]);
    // col3 = 0+3, -3+9, -1+0, 0
    expect(eq.getMatrixStr()).toEqual([
      "0 0 0 3 -1 0 0", // N
      "0 2 1 6 -2 -2 -1", // O
      "0 2 1 -1 -1 0 0", // Na
      "0 0 1 0 0 0 -2", // H
    ]);
    expect(eq.findRowForAction()).toEqual({ nRow: 0, nCols: [3, 4] });
    eq.onSimpleSolve(0, 3, 4);
    expect(eq.getSolves()).toEqual([
      { dstCol: 3, refs: [{ srcCol: 4, k: { x: 1, y: 3 } }] },
      { dstCol: 0, refs: [{ srcCol: 3, k: { x: 1, y: 1 } }] },
    ]);
    // col4 = 1/3*6-2, -1/3*1-1, 0
    expect(eq.getMatrixStr()).toEqual([
      "0 2 1 0 0 -2 -1", // O
      "0 2 1 0 -4/3 0 0", // Na
      "0 0 1 0 0 0 -2", // H
    ]);
    expect(eq.findRowForAction()).toEqual({ nRow: 2, nCols: [2, 6] });
    eq.onSimpleSolve(2, 2, 6);
    expect(eq.getSolves()).toEqual([
      { dstCol: 2, refs: [{ srcCol: 6, k: { x: 2, y: 1 } }] },
      { dstCol: 3, refs: [{ srcCol: 4, k: { x: 1, y: 3 } }] },
      { dstCol: 0, refs: [{ srcCol: 3, k: { x: 1, y: 1 } }] },
    ]);
    // col6 = 2*1-1, 2*1
    expect(eq.getMatrixStr()).toEqual([
      "0 2 0 0 0 -2 1", // O
      "0 2 0 0 -4/3 0 2", // Na
    ]);
    expect(eq.findRowForAction()).toEqual({ nRow: -1 });
    expect(eq.try2RowsUnit()).toBe(true);
    expect(eq.getSolves()).toEqual([
      {
        dstCol: 1,
        refs: [
          { srcCol: 5, k: { x: 1, y: 1 } },
          { srcCol: 6, k: { x: -1, y: 2 } },
        ],
      },
      { dstCol: 2, refs: [{ srcCol: 6, k: { x: 2, y: 1 } }] },
      { dstCol: 3, refs: [{ srcCol: 4, k: { x: 1, y: 3 } }] },
      { dstCol: 0, refs: [{ srcCol: 3, k: { x: 1, y: 1 } }] },
    ]);
    expect(eq.getMatrixStr()).toEqual(["0 0 0 0 -2/3 1 1/2"]);
    expect(eq.findRowForAction()).toEqual({ nRow: -1 });
    expect(eq.try2RowsUnit()).toBe(false);
    expect(eq.getUnknownIndices().join(" ")).toBe("4 5 6");
    expect(eq.searchKoeffs()).toBe(true);
    expect(eq.K.join(" ")).toBe("2 2 4 2 6 3 2");
  });

  it("21Cs + 26HNO3 -> 21CsNO3 + NO + N2O + N2 + 13H2O", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`21Cs + 26HNO3 -> 21CsNO3 + NO + N2O + N2 + 13H2O`);
    //    Cs HNO3  CsNO3 NO N2O N2 H2O
    // Cs  1  0     -1    0   0  0   0
    // H   0  1      0    0   0  0  -2
    // N   0  1     -1   -1  -2 -2   0
    // O   0  3     -3   -1  -1  0  -1
    expect(eq.getMatrixStr()).toEqual([
      "1 0 -1 0 0 0 0",
      "0 1 0 0 0 0 -2",
      "0 1 -1 -1 -2 -2 0",
      "0 3 -3 -1 -1 0 -1",
    ]);
    const res = eq.findRowForAction();
    expect(res).toEqual({ nRow: 0, nCols: [0, 2] });
    eq.onSimpleSolve(0, 0, 2);
    expect(eq.getSolves()).toEqual([
      { dstCol: 0, refs: [{ srcCol: 2, k: { x: 1, y: 1 } }] },
    ]);
    expect(eq.getMatrixStr()).toEqual([
      "0 1 0 0 0 0 -2", // H
      "0 1 -1 -1 -2 -2 0", // N
      "0 3 -3 -1 -1 0 -1", // O
    ]);
    const res1 = eq.findRowForAction();
    expect(res1).toEqual({ nRow: 0, nCols: [1, 6] });
    eq.onSimpleSolve(0, 1, 6);
    expect(eq.getSolves()).toEqual([
      { dstCol: 1, refs: [{ srcCol: 6, k: { x: 2, y: 1 } }] },
      { dstCol: 0, refs: [{ srcCol: 2, k: { x: 1, y: 1 } }] },
    ]);
    // col6 += col1*2  0+1*2 = 2, -1+3*2 = 5
    expect(eq.getMatrixStr()).toEqual([
      "0 0 -1 -1 -2 -2 2", // N
      "0 0 -3 -1 -1 0 5", // O
    ]);
    expect(eq.findRowForAction()).toEqual({ nRow: -1 });
    expect(eq.try2RowsUnit()).toBe(true);
    expect(eq.getSolves()).toEqual([
      {
        dstCol: 2,
        refs: [
          { srcCol: 3, k: { x: -1, y: 1 } },
          { srcCol: 4, k: { x: -2, y: 1 } },
          { srcCol: 5, k: { x: -2, y: 1 } },
          { srcCol: 6, k: { x: 2, y: 1 } },
        ],
      },
      { dstCol: 1, refs: [{ srcCol: 6, k: { x: 2, y: 1 } }] },
      { dstCol: 0, refs: [{ srcCol: 2, k: { x: 1, y: 1 } }] },
    ]);
    expect(eq.getMatrixStr()).toEqual(["0 0 0 -2/3 -5/3 -2 1/3"]);
    expect(eq.getUnknownIndices().join(" ")).toBe("3 4 5 6");
    expect(eq.searchKoeffs()).toBe(true);
    expect(eq.K.join(" ")).toBe("21 26 21 1 1 1 13");
  });

  it("Multipiers", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`CuSO4*5H2O + NaBr "T"-> Cu2SO4 + Na2SO4 + Br2 + H2O`);
    eq.solve();
    expect(eq.getMessage()).toBe("");
    expect(eq.K.join(" ")).toBe("2 2 1 1 1 10");
    expect(eq.getExpr()?.src?.trim()).toBe(
      `2CuSO4*5H2O + 2NaBr "T"-> Cu2SO4 + Na2SO4 + Br2 + 10H2O`
    );
  });

  it("Abstract items", () => {
    const eq = new ChemEquation();
    eq.initBySrc(`{M}OH + H2SO4 -> {M}2SO4 + H2O`);
    eq.solve();
    expect(eq.getMessage()).toBe("");
    expect(eq.K.join(" ")).toBe("2 1 1 2");
    expect(eq.getExpr()?.src?.trim()).toBe(`2{M}OH + H2SO4 -> {M}2SO4 + 2H2O`);
  });
});
