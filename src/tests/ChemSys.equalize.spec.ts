import { ChemSys } from "../ChemSys";

describe("ChemSys.equalize", () => {
  it("success", () => {
    const res = ChemSys.equalize("Na2S + KMnO4 + H2O -> MnO2 + NaOH + KOH + S");
    expect(res.getMessage()).toBe("");
    expect(res.src.trim()).toBe(
      "3Na2S + 2KMnO4 + 4H2O -> 2MnO2 + 6NaOH + 2KOH + 3S"
    );
    expect(res.getAgents().map((a) => a.n.num)).toEqual([3, 2, 4, 2, 6, 2, 3]);
  });
  it("Bad source", () => {
    const res = ChemSys.equalize("H2SO4 + MOH -> M2SO4 + H2O");
    expect(res.getMessage()).toBe("Unknown element 'M'");
  });
  it("Abstract source", () => {
    const res = ChemSys.equalize("FeO + H2O + O2 -> Fe2O3*'n'H2O");
    expect(res.getMessage()).toBe(
      "Can't balance expression with abstract coefficients"
    );
  });
  it("Mineral series", () => {
    const res = ChemSys.equalize(
      "(Zn,Cu)5(CO3)2(OH)6 + HCl = ZnCl2 + CuCl2 + CO2 + H2O"
    );
    expect(res.getMessage()).toBe(
      "Can't balance expression with mineral series"
    );
  });
  it("Balance is not found", () => {
    const res = ChemSys.equalize("Cr2O3 + H2SO4 = CrO + H2S");
    expect(res.getMessage()).toBe("Balance is not found");
  });
});
