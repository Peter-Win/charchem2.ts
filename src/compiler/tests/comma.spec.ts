import { compile } from "../compile";
import { textFormula } from "../../textBuilder/textFormula";
import { isAbstract } from "../../inspectors/isAbstract";

describe("Comma", () => {
  it("Simple", () => {
    const expr = compile("(Ni,Co,Fe)As'x'");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(expr, "text")).toBe("(Ni,Co,Fe)Asx");
    expect(isAbstract(expr)).toBe(true);
  });
});
