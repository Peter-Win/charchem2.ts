import { ChemSys } from "../ChemSys";

describe("ChemSys.makeTextFormula", () => {
  const { dictTextRules } = ChemSys;
  it("text", () => {
    expect(ChemSys.makeTextFormula("H2O")).toBe("H2O");
    expect(ChemSys.makeTextFormula("H2SO4", dictTextRules.html)).toBe(
      "H<sub>2</sub>SO<sub>4</sub>"
    );
  });
  it("expr", () => {
    const expr = ChemSys.compile("H2SO4");
    expect(ChemSys.makeTextFormula(expr)).toBe("H2SO4");
    expect(ChemSys.makeTextFormula(expr, dictTextRules.html)).toBe(
      "H<sub>2</sub>SO<sub>4</sub>"
    );
    expect(ChemSys.makeTextFormula(expr, dictTextRules.mhchem)).toBe(
      "H_{2}SO_{4}"
    );
  });
});
