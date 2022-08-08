import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { PathSeg } from "../path";

export const drawRect = (
  surface: AbstractSurface,
  offset: Point,
  rect: Rect,
  style: PathStyle
) => {
  if (surface.drawRect) {
    surface.drawRect(offset, rect, style);
  } else {
    const segs: PathSeg[] = [
      { cmd: "M", pt: rect.A },
      { cmd: "H", x: rect.B.x },
      { cmd: "V", y: rect.B.y },
      { cmd: "H", x: rect.A.x },
      { cmd: "Z" },
    ];
    surface.drawPath(offset, segs, style);
  }
};
