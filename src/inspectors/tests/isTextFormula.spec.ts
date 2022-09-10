import { compile } from "../../compiler/compile";
import { isTextFormula } from "../isTextFormula";

describe("IsTextFormula", () => {
  it("Text", () => {
    expect(isTextFormula(compile("H2SO4"))).toBe(true);
    expect(isTextFormula(compile("K3[Fe(CN)6]"))).toBe(true);
    expect(isTextFormula(compile('Ca^2+ + PO4^2- -> Ca3(PO4)2"|v"'))).toBe(
      true
    );
    expect(isTextFormula(compile("CuSO4*5H2O"))).toBe(true);
    expect(isTextFormula(compile("[2Fe2O3*3H2O]"))).toBe(true);
  });
  it("Bonds", () => {
    const expr1 = compile("H2C=CH-C%N");
    const bonds1 = expr1.getAgents()[0]!.bonds;
    expect(bonds1[0]!.isText).toBe(true);
    expect(bonds1[1]!.isText).toBe(true);
    expect(isTextFormula(expr1)).toBe(true);

    expect(isTextFormula(compile("CH3`-CH2`-HO"))).toBe(true);
    expect(isTextFormula(compile("-/"))).toBe(false);
    expect(isTextFormula(compile("-|"))).toBe(false);
    expect(isTextFormula(compile("//\\"))).toBe(false);
  });
  it("dots", () => {
    expect(isTextFormula(compile("HOH"))).toBe(true);
    expect(isTextFormula(compile("H$dots(0)OH"))).toBe(false);
  });
});
