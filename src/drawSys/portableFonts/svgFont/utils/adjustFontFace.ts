import { parsePath } from "../../../utils/parsePath";
import { tracePath } from "../../../utils/tracePath";
import { Point } from "../../../../math/Point";
import { ifDef } from "../../../../utils/ifDef";
import { CommonFontFace } from "../../../CommonFontFace";
import { SvgFontGlyph } from "../SvgFontTypes";

export const findMaxY = (g?: SvgFontGlyph) => {
  if (!g || !g.d) return undefined;
  const segs = parsePath(g.d);
  let maxY = 0;
  tracePath(segs, {
    onM(p: Point) {
      maxY = Math.max(maxY, p.y);
    },
    onL(p: Point): void {
      maxY = Math.max(maxY, p.y);
    },
    onC(cp1: Point, cp2: Point, p: Point): void {
      maxY = Math.max(maxY, p.y);
      maxY = Math.max(maxY, cp1.y);
      maxY = Math.max(maxY, cp2.y);
    },
    onQ(cp: Point, p: Point): void {
      maxY = Math.max(maxY, p.y);
      maxY = Math.max(maxY, cp.y);
    },
    onA(): void {
      throw new Error("Function not implemented.");
    },
  });
  return maxY;
};

// It turned out that sometimes these values do not correspond to reality.
// As a result, the top of the text may be cut off.
// Therefore, we need to check the dimensions and make changes if necessary.

export const adjustFontFace = (
  ff: CommonFontFace,
  codeMap: Record<string, SvgFontGlyph>
): CommonFontFace => {
  const res = { ...ff };
  ifDef(findMaxY(codeMap.F), (y) => {
    res.capHeight = Math.max(res.capHeight, y);
    res.ascent = Math.max(res.ascent, y);
  });
  ifDef(findMaxY(codeMap.f), (y) => {
    res.ascent = Math.max(res.ascent, y);
  });
  return res;
};
