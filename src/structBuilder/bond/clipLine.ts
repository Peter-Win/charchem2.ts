import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";

export const clipLine = (
  rect: Rect,
  ptInside: Point,
  ptOutside: Point
): Point | undefined => {
  const { inside, b } = rect.clip(ptInside, ptOutside);
  return inside ? b : ptInside;
};
