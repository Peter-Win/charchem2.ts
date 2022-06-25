import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { isAbstract } from "../../inspectors/isAbstract";

describe("Comma", () => {
  it("Simple", () => {
    const expr = compile("(Ni,Co,Fe)As'x'");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("(Ni,Co,Fe)Asx");
    expect(isAbstract(expr)).toBe(true);
  });
});
