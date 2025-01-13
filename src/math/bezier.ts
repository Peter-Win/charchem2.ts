import { Point } from "./Point";

/**
 * Cubic Bezier
 * (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3,  0<=t<=1
 *  umt3         3*umt2*t          3*umt*t2
 * @param p 4 points of a cubic bezier curve
 * @param t 0 <= t <= 1
 */
export const bezierCubic = (
  p: readonly [Point, Point, Point, Point],
  t: number
): Point => {
  const t2 = t * t;
  const t3 = t2 * t;
  const umt = 1 - t;
  const umt2 = umt * umt;
  const umt3 = umt2 * umt;
  return p[0]
    .times(umt3)
    .iadd(p[1].times(3 * umt2 * t))
    .iadd(p[2].times(3 * umt * t2))
    .iadd(p[3].times(t3));
};

/**
 * Quadratic Bézier
 * (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
 * @param p 3 points of a quadratic bezier curve
 * @param t 0 <= t <= 1
 */
export const bezierQuadratic = (
  p: readonly [Point, Point, Point],
  t: number
): Point => {
  const t2 = t * t;
  const umt = 1 - t;
  const umt2 = umt * umt;
  return p[0]
    .times(umt2)
    .iadd(p[1].times(2 * umt * t))
    .iadd(p[2].times(t2));
};
