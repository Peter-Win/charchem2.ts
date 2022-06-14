import { parseKern } from "./parseKern";
import { SvgFontGlyph } from "../SvgFontTypes";
import { lightXmlParser } from "../../../../utils/xml/lightXmlParser";

describe("parseKern", () => {
  it("u1+u2", () => {
    const codeMap: Record<string, SvgFontGlyph> = {
      A: { code: "A", name: "Aname", dx: 1 },
      t: { code: "t", name: "tname", dx: 1 },
    };
    const nameMap: Record<string, SvgFontGlyph> = {};
    const kernMap: Record<string, number> = {};
    lightXmlParser(`<hkern u1="A" u2="t" k="33" />`, (tag, attrs) =>
      parseKern(attrs, codeMap, nameMap, kernMap)
    );
    expect(kernMap).toEqual({ "Aname:tname": 33 });
  });
  it("2 names lists", () => {
    const codeMap = {};
    const nameMap: Record<string, SvgFontGlyph> = [
      "u01",
      "u02",
      "u101",
      "u102",
    ].reduce(
      (map, name) => ({ ...map, [name]: { name, dx: 2 } }),
      {} as Record<string, SvgFontGlyph>
    );
    const kernMap: Record<string, number> = {};
    lightXmlParser(
      `<hkern g1="u01,u02" g2="u101,u102" k="12" />`,
      (tag, attrs) => parseKern(attrs, codeMap, nameMap, kernMap)
    );
    expect(kernMap).toEqual({
      "u01:u101": 12,
      "u02:u101": 12,
      "u01:u102": 12,
      "u02:u102": 12,
    });
  });
});
