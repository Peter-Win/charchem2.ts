import { ChemK } from "../../core/ChemK";
import { compile } from "../../compiler/compile";
import { isSuitableForEquation } from "../isSuitableForEquation";

describe("isSuitableForEquation", () => {
  it("success", () => {
    expect(isSuitableForEquation(compile("H2 + O2 = H2O"))).toBeUndefined();
    // expressions with abstract items are correct
    expect(
      isSuitableForEquation(compile("{M}OH + HCl = {M}Cl + H2O"))
    ).toBeUndefined();
    // expressions with abstract coefficients are correct
    expect(
      isSuitableForEquation(compile("'n'CaCO3 -> CaO + CO2"))
    ).toBeUndefined();
  });
  it("abstract", () => {
    const res = isSuitableForEquation(compile("Fe + O2 -> Fe'n'O'm'"));
    expect(res?.reason).toBe("abstract");
  });
  it("float", () => {
    // в текущей реализации нельзя указать дробные числовые коэффициенты
    const expr = compile("H2 + O2 = H2O");
    expect(expr.getMessage()).toBe("");
    expr.walk({
      itemPre(obj) {
        // eslint-disable-next-line no-param-reassign
        obj.n = new ChemK(1.5);
      },
    });
    const res = isSuitableForEquation(expr);
    expect(res?.reason).toBe("float");
  });
});
