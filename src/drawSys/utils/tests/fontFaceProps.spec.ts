import { CommonFontFace } from "../../CommonFontFace";
import { getBaseline, getFontHeight } from "../fontFaceProps";
import { lightXmlParser } from "../../../utils/xml/lightXmlParser";
import { createFontFace } from "../createFontFace";

const fontFaceFromDef = (def: string): CommonFontFace => {
  let res = {} as CommonFontFace;
  lightXmlParser(def, (tag, attrs) => {
    res = createFontFace(attrs);
  });
  return res;
};

// from IBMPlexSans-Regular.svg
const richDef = `
  <font-face 
    font-family="IBM Plex Sans"
    font-weight="400"
    font-stretch="normal"
    units-per-em="1000"
    panose-1="2 11 5 3 5 2 3 0 2 3"
    ascent="780"
    descent="-220"
    x-height="516"
    cap-height="698"
    bbox="-260 -245 1241 1119"
    underline-thickness="60"
    underline-position="-125"
    unicode-range="U+000D-FB02"
  />`;
const richFontFace = fontFaceFromDef(richDef);

// from amaranth-regular.svg
const poorDef = `<font-face units-per-em="2048" ascent="1536" descent="-512" />`;
const poorFontFace = fontFaceFromDef(poorDef);

it("getBaseline", () => {
  expect(getBaseline(richFontFace)).toBeCloseTo(780);
  expect(getBaseline(poorFontFace)).toBe(1536);
});

it("getFontHeight", () => {
  expect(getFontHeight(richFontFace)).toBe(780 + 220);
  expect(getFontHeight(poorFontFace)).toBe(1536 + 512);
});
