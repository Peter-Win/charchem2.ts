import { Point } from "./Point";

const oneThird = 1 / 3;
const twoThirds = 2 / 3;

/**
 * Convert quadratic Bezier curve to cubic
 *            2 * (p1-p0)       p2 - p1
 *  p0,  p0 + -----------, p1 + -------, p2
 *                3                3
 * @param p 3 control points of a Quadratic bezier curve
 * @returns 4 control points of a cubic bezier curve
 */
export const cubicBezierFromQuadratic = ([p0, p1, p2]: readonly [
  Point,
  Point,
  Point
]): [Point, Point, Point, Point] => [
  p0,
  p1.minus(p0).scale(twoThirds).iadd(p0),
  p2.minus(p1).scale(oneThird).iadd(p1),
  p2,
];
