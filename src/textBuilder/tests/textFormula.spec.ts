import { compile } from "../../compiler/compile";
import { textFormula } from "../textFormula";

const htmlBlock = `<span class="cch-expr">
  <span class="cch-agent">
    <span>H</span>
    <span class="cch-supsub">
      <span></span>
      <span>2</span>
    </span>
    <span>O</span>
  </span>
</span>
`.replace(/\r/g, "");
const htmlInline = htmlBlock.replace(/>(\s+)</g, "><").trim();

describe("textFormula", () => {
  it("H2O", () => {
    const expr = compile("H2O");
    expect(textFormula(expr, { type: "html" })).toBe(htmlInline);
    expect(textFormula(expr, { type: "html", options: { indent: "  " } })).toBe(
      htmlBlock
    );
    expect(textFormula(expr, "text")).toBe("H2O");
    expect(textFormula(expr, "TeX")).toBe(`\\ce{H_2O}`);
  });
});
