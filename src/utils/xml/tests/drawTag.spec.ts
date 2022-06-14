import { drawTag } from "../drawTag";
import { escapeXml, hexLow } from "../escapeXml";

describe("drawTag", () => {
  it("without attrs", () => {
    expect(drawTag("defs")).toBe("<defs>");
  });
  it("without attrs, closed", () => {
    expect(drawTag("missing-glyph", {}, true)).toBe("<missing-glyph />");
  });
  it("single attr", () => {
    expect(drawTag("first", { name: "abcd" })).toBe('<first name="abcd">');
  });
  it("two attrs, closed", () => {
    expect(drawTag("glyph", { unicode: " ", "horiz-adv-x": "522" }, true)).toBe(
      '<glyph unicode=" " horiz-adv-x="522" />'
    );
  });
  it("escape", () => {
    expect(drawTag("glyph", { unicode: "Σ" }, true)).toBe(
      '<glyph unicode="Σ" />'
    );
    expect(
      drawTag("glyph", { unicode: "À" }, true, (v) => escapeXml(v, hexLow))
    ).toBe('<glyph unicode="&#xc0;" />');
  });
});
