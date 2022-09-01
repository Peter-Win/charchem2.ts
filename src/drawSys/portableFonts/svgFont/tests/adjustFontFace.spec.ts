import { XmlAttrs } from "../../../../utils/xml/xmlTypes";
import { lightXmlParser } from "../../../../utils/xml/lightXmlParser";
import { CommonFontFace } from "../../../CommonFontFace";
import { createFontFace } from "../../../utils/createFontFace";
import { adjustFontFace, findMaxY } from "../utils/adjustFontFace";
import { SvgFontGlyph } from "../SvgFontTypes";

const str2ff = (
  fontFaceTag: string
): [CommonFontFace, Record<string, SvgFontGlyph>] => {
  let ff: CommonFontFace | undefined;
  const cmap: Record<string, SvgFontGlyph> = {};
  lightXmlParser(fontFaceTag, (tag: string, attrs: XmlAttrs) => {
    if (tag === "font-face") ff = createFontFace(attrs);
    else if (tag === "glyph") {
      const { unicode, d } = attrs;
      if (unicode)
        cmap[unicode] = {
          name: attrs.name!,
          code: unicode,
          dx: 0,
          d,
        };
    }
  });
  if (!ff) throw new Error("Expected font-face tag");
  return [ff, cmap];
};

describe("adjustFontFace", () => {
  it("Correct settings. Correction is not required", () => {
    const xml = `<font-face 
            font-family="Cambria"
            font-weight="400"
            font-stretch="normal"
            units-per-em="2048"
            panose-1="2 4 5 3 5 4 6 3 2 4"
            ascent="1593"
            descent="-455"
            x-height="956"
            cap-height="1365"
            bbox="-3020 -1370 3185 4732"
            underline-thickness="116"
            underline-position="-183"
            unicode-range="U+000D-1D7FF"
        />
        <glyph glyph-name="F" unicode="F" horiz-adv-x="1099" 
          d="M1033 1365v-302h-98q-22 68 -42.5 110t-43 64t-52.5 31t-79 9h-293v-544h206q44 0 69 14.5t41.5 48.5t31.5 105h94v-422h-94q-15 68 -32 102.5t-40.5 49t-69.5 14.5h-206v-392q0 -60 7 -96t23 -57t43 -31.5t67 -19.5v-49h-444v49q62 16 83 35.5t27.5 55.5t6.5 110v865
          q0 69 -5 100.5t-16.5 49t-30.5 28t-65 23.5v49h912z" />
        <glyph glyph-name="f" unicode="f" horiz-adv-x="620" 
          d="M611 855h-239v-605q0 -67 6.5 -101t19 -51.5t33 -28t65.5 -20.5v-49h-409v49q44 12 63 23t29.5 28t15.5 49t5 101v605h-121v51q38 6 50.5 9.5t24 10.5t20 20t15 38.5t10.5 71.5q9 109 39.5 177t89 116t125 67.5t156.5 19.5q79 0 134 -11v-181h-99q-19 59 -44.5 83.5
          t-71.5 24.5q-33 0 -55.5 -9t-41.5 -28t-32.5 -51t-20 -79.5t-6.5 -123.5v-105h239v-101z" />
        `;
    const [src, codeMap] = str2ff(xml);
    expect(src.ascent).toBe(1593);
    const dst = adjustFontFace(src, codeMap);
    expect(dst.ascent).toBe(1593);
  });
  it("Incorrect parameters. A fix is required.", () => {
    const xml = `
        <font-face 
        font-family="Hussar"
        font-weight="700"
        font-stretch="normal"
        units-per-em="1000"
        panose-1="0 0 8 0 0 0 0 0 0 0"
        ascent="750"
        descent="-250"
        x-height="513"
        cap-height="825"
        bbox="-167 -351 1554.23 1227.39"
        underline-thickness="50"
        underline-position="-50"
        stemh="188"
        stemv="860"
        unicode-range="U+0020-10FFFD"
      />
      <glyph glyph-name="F" unicode="F" horiz-adv-x="567" 
      d="M537 825v-165h-289v-164h267v-165h-267v-331h-188v825h477z" />
      <glyph glyph-name="f" unicode="f" horiz-adv-x="523" 
      d="M125 585v37c0 150 73 253 201 253c90 0 146 -46 146 -46l-62 -125s-24 14 -53 14c-45 0 -55 -30 -55 -101v-32h118v-135h-118v-450h-177v450h-74v135h74z" />
        `;
    const [src, codeMap] = str2ff(xml);
    expect(src.ascent).toBe(750);
    expect(Object.keys(codeMap)).toEqual(["F", "f"]);
    const yF = findMaxY(codeMap.F);
    expect(yF).toBeDefined();
    expect(yF).toBe(src.capHeight); // Реальная высота буквы F соответствует capHeight
    const yf = findMaxY(codeMap.f);
    expect(yf).toBeDefined();
    expect(yf).toBeGreaterThan(src.ascent); // Обычно буква f достигает макс высоты. Здесь она выше ascent

    const dst = adjustFontFace(src, codeMap);
    expect(dst.ascent).toBe(yf);
  });
});
