import { buildTextNodes } from "../../buildTextNodes";
import { compile } from "../../../compiler/compile";
import { htmlPoor } from "../htmlPoor";
import { OptionsHtmlPoor } from "../OptionsHtmlPoor";

const cvt = (src: string, op?: OptionsHtmlPoor): string => {
  const expr = compile(src);
  if (!expr.isOk()) return expr.getMessage();
  const node = buildTextNodes(expr);
  return htmlPoor(node, op);
};

describe("htmlPoor", () => {
  it("atom", () => {
    expect(cvt("H2SO4")).toBe("H<sub>2</sub>SO<sub>4</sub>");
    expect(cvt("$atomColor1(blue)H2O")).toBe(
      `<span style="color: blue">H</span><sub>2</sub>O`
    );
  });
  it("custom", () => {
    expect(cvt("{R}-OH")).toBe("<i>R</i>-OH");
    expect(cvt("{R}-OH", { tags: "span" })).toBe("R-OH");
  });
});
