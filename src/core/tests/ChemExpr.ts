import { compile } from "../../compiler/compile";

describe("ChemExpr", () => {
  it("html", () => {
    const expr = compile("H2O");
    expect(expr.html()).toBe("H<sub>2</sub>O");
  });
  it("isLinear", () => {
    expect(compile("H2SO4").isLinear()).toBe(true);
    expect(compile("CH3-CH2-OH").isLinear()).toBe(true);
    expect(compile("CH3-C<||O>-CH3").isLinear()).toBe(false);
  });
});
