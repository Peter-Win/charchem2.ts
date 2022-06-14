import { kernKey } from "../kernKey";
import { SvgFont } from "../SvgFont";

const xmlCode = `
<metadata>...ignored...</metadata>
<font id="Roboto-Bold" horiz-adv-x="1098" >
  <font-face 
    font-family="Roboto"
    font-weight="700"
    font-stretch="normal"
    units-per-em="2048"
    panose-1="2 0 0 0 0 0 0 0 0 0"
    ascent="1536"
    descent="-512"
    x-height="1082"
    cap-height="1456"
    bbox="-1488 -555 2439 2163"
    underline-thickness="100"
    underline-position="-200"
    unicode-range="U+0002-FFFD"
  />
<missing-glyph horiz-adv-x="908" d="stub" />
<glyph glyph-name="space" unicode=" " horiz-adv-x="510" />
<glyph glyph-name="plus" unicode="+" horiz-adv-x="1118" 
  d="M694 815h361v-261h-361v-408h-275v408h-362v261h362v391h275v-391z" />
<glyph glyph-name="one" unicode="1" horiz-adv-x="1175" 
  d="M801 0h-289v1114l-345 -107v235l603 216h31v-1458z" />
<glyph glyph-name="uni0422" unicode="&#x422;" horiz-adv-x="1267" 
  d="M1226 1213h-446v-1213h-300v1213h-440v243h1186v-243z" />
<glyph glyph-name="uni0422.c2sc" horiz-adv-x="1105" 
  d="M1071 931h-378v-931h-290v931h-371v234h1039v-234z" />
<hkern u1="+" g2="one" k="10" />`;

describe("SvgFont", () => {
  it("Roboto-Bold", () => {
    const font = SvgFont.create(xmlCode);
    expect(font.id).toBe("Roboto-Bold");
    const { fontFace } = font;
    expect(fontFace.fontFamily).toBe("Roboto");
    expect(fontFace.fontWeight).toBe("700");
    expect(fontFace.fontStretch).toBe("normal");
    expect(fontFace.unitsPerEm).toBe(2048);
    expect(fontFace.ascent).toBe(1536);
    expect(fontFace.descent).toBe(-512);
    expect(fontFace.xHeight).toBe(1082);
    expect(fontFace.capHeight).toBe(1456);
    expect(fontFace.bbox).toEqual([-1488, -555, 2439, 2163]);
    expect(fontFace.underlineThickness).toBe(100);
    expect(fontFace.underlinePosition).toBe(-200);

    expect(font.missingGlyph).toHaveProperty("d", "stub");
    expect(font.missingGlyph).toHaveProperty("dx", 908);

    expect(font.glyphs).toHaveLength(5);
    expect(new Set(Object.keys(font.codeMap))).toEqual(
      new Set([" ", "+", "1", "Т"])
    );
    expect(Object.keys(font.nameMap)).toEqual([
      "space",
      "plus",
      "one",
      "uni0422",
      "uni0422.c2sc",
    ]);
    expect(font.codeMap[" "]).toHaveProperty("d", undefined);
    expect(font.codeMap[" "]).toHaveProperty("dx", 510);
    expect(font.kernMap[kernKey("plus", "one")]).toBe(10);
  });
  it("error: invalid font-face", () => {
    expect(() => SvgFont.create("")).toThrow(/^FontFace not found$/);
  });
  it("textToGlyphs", () => {
    const font = SvgFont.create(xmlCode);
    const list = font.textToGlyphs("Т + 1");
    expect(list).toHaveLength(5);
    expect(list.map((g) => g.name).join(",")).toBe(
      "uni0422,space,plus,space,one"
    );
  });
  it("traceGlyphs", () => {
    const font = SvgFont.create(xmlCode);
    const space = font.nameMap.space!;
    const plus = font.nameMap.plus!;
    const one = font.nameMap.one!;
    const correction = font.kernMap[kernKey("plus", "one")] || 0;
    const posList: number[] = [];
    const width = font.traceGlyphs([space, plus, one], (x) => posList.push(x));
    expect(width).toBeCloseTo(space.dx + plus.dx + one.dx - correction);
    expect(posList).toEqual([0, space.dx, space.dx + plus.dx - correction]);
  });
});
