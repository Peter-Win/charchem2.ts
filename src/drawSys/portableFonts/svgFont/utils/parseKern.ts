import { XmlAttrs } from "../../../../utils/xml/xmlTypes";
import { SvgFontGlyph } from "../SvgFontTypes";
import { kernKey } from "../kernKey";

export const parseKern = (
  kern: XmlAttrs,
  codeMap: Record<string, SvgFontGlyph>,
  nameMap: Record<string, SvgFontGlyph>,
  kernMap: Record<string, number> // IN/OUT
) => {
  const k: number = +kern.k!;
  if (!k) return;
  const buildNames = (u?: string, g?: string): string[] => {
    if (u) {
      const glyph = codeMap[u];
      if (glyph) {
        return [glyph.name];
      }
    } else if (g) {
      return g
        .split(",")
        .map((name) => {
          const glyph = nameMap[name];
          if (!glyph) {
            return "";
          }
          return glyph.name;
        })
        .filter((name) => !!name);
    }
    return [];
  };
  buildNames(kern.u1, kern.g1).forEach((name1) => {
    buildNames(kern.u2, kern.g2).forEach((name2) => {
      // eslint-disable-next-line no-param-reassign
      kernMap[kernKey(name1, name2)] = k;
    });
  });
};
