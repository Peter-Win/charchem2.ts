import { compile } from "../../compiler/compile";
import { isAbstract } from "../isAbstract";

describe("isAbstract", () => {
  it("Expression", () => {
    expect(isAbstract(compile("'n'H2O"))).toBe(true);
    expect(isAbstract(compile("C'n'H'2n+2'"))).toBe(true);
    expect(isAbstract(compile("CuSO4*'n'H2O"))).toBe(true);
    expect(isAbstract(compile("Cu[NH3]'n'"))).toBe(true);

    expect(isAbstract(compile("2H2O"))).toBe(false);
  });
});
