import { ifDef } from "../../utils/ifDef";
import { PathStyle, LineCapShape, LineJoinShape } from "../AbstractSurface";
import { cssColor2ps } from "./color2ps";

const capMap: Record<LineCapShape, number> = {
  butt: 0,
  round: 1,
  square: 2,
};
const joinMap: Record<LineJoinShape, number> = {
  arcs: 0,
  round: 1,
  "miter-clip": 2,
  miter: 2,
  bevel: 2,
};

export const style2ps = (style: PathStyle | undefined): string[] => {
  const result: string[] = [];
  if (style) {
    const { fill, stroke, strokeWidth } = style;

    const cap = ifDef(style.cap, (it) => capMap[it]);
    if (typeof cap === "number") result.push(`${cap} setlinecap`);

    const join = ifDef(style.join, (it) => joinMap[it]);
    if (typeof join === "number") result.push(`${join} setlinejoin`);

    if (fill) {
      result.push(cssColor2ps(fill));
      result.push("fill");
    } else if (stroke) {
      if (strokeWidth) {
        result.push(`${strokeWidth} setlinewidth`);
      }
      result.push(cssColor2ps(stroke));
      result.push("stroke");
    }
  }
  return result;
};
