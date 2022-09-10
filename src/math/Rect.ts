/**
 * Rectangle object
 * Created by PeterWin
 * ver 1.1 on 26.04.2017
 * ver 2.0 on 30.05.2022
 */
import { Point } from "./Point";
import { Double } from "../types";
import { is0, toa } from "./index";

/* eslint-disable no-bitwise */

export class Rect {
  readonly A: Point;

  readonly B: Point;

  constructor();

  constructor(a: Point, b: Point);

  constructor(ax: Double, ay: Double, bx: Double, by: Double);

  constructor(
    a?: Point | Double,
    b?: Point | Double,
    bx?: Double,
    by?: Double
  ) {
    if (typeof a === "number" && typeof b === "number") {
      this.A = new Point(a, b);
      this.B = new Point(bx, by);
    } else if (a instanceof Point && b instanceof Point) {
      this.A = a.clone();
      this.B = b.clone();
    } else {
      this.A = new Point();
      this.B = new Point();
    }
  }

  get left(): Double {
    return this.A.x;
  }

  get top(): Double {
    return this.A.y;
  }

  get right(): Double {
    return this.B.x;
  }

  get bottom(): Double {
    return this.B.y;
  }

  get width(): Double {
    return this.B.x - this.A.x;
  }

  get height(): Double {
    return this.B.y - this.A.y;
  }

  get size(): Point {
    return new Point(this.width, this.height);
  }

  get cx(): Double {
    return this.left + this.width * 0.5;
  }

  get cy(): Double {
    return this.top + this.height * 0.5;
  }

  get center(): Point {
    return new Point(this.cx, this.cy);
  }

  toString() {
    return `{${toa(this.left)}, ${toa(this.top)}, ${toa(this.right)}, ${toa(
      this.bottom
    )}}`;
  }

  isEmpty(): boolean {
    return is0(this.width) && is0(this.height);
  }

  clone(): Rect {
    return new Rect(this.A, this.B);
  }

  updatePoint(pt: Point) {
    this.A.x = Math.min(this.A.x, pt.x);
    this.A.y = Math.min(this.A.y, pt.y);
    this.B.x = Math.max(this.B.x, pt.x);
    this.B.y = Math.max(this.B.y, pt.y);
  }

  unite(rc: Rect): Rect {
    this.updatePoint(rc.A);
    this.updatePoint(rc.B);
    return this;
  }

  move(delta: Point) {
    this.A.iadd(delta);
    this.B.iadd(delta);
  }

  moveXY(deltaX: Double, deltaY: Double) {
    this.A.add(deltaX, deltaY);
    this.B.add(deltaX, deltaY);
  }

  contains(pt: Point): boolean {
    return (
      this.A.x <= pt.x &&
      this.B.x >= pt.x &&
      this.A.y <= pt.y &&
      this.B.y >= pt.y
    );
  }

  grow(delta: Double, deltaY?: Double): Rect {
    const realDeltaY: Double = deltaY ?? delta;
    this.A.x -= delta;
    this.B.x += delta;
    this.A.y -= realDeltaY;
    this.B.y += realDeltaY;
    return this;
  }

  scale(k: Double) {
    this.A.scale(k);
    this.B.scale(k);
  }

  clip(a: Point, b: Point): { inside: boolean; a: Point; b: Point } {
    let { x: x1, y: y1 } = a;
    let { x: x2, y: y2 } = b;
    const { left, right, top, bottom } = this;

    const makeOutcodes = (x: number, y: number): number =>
      mkMask(0, x < left) |
      mkMask(1, y < top) |
      mkMask(2, x > right) |
      mkMask(3, y > bottom);
    let ocu1 = makeOutcodes(x1, y1);
    let ocu2 = makeOutcodes(x2, y2);
    let inside = (ocu1 | ocu2) === 0;
    let outside = (ocu1 & ocu2) !== 0;
    let isSwap = false;
    while (!outside && !inside) {
      // swap endpoints if necessary so that (x1,y1) needs to be clipped
      if (ocu1 === 0) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
        [ocu1, ocu2] = [ocu2, ocu1];
        isSwap = !isSwap;
      }
      if (isMask(0, ocu1)) {
        // clip left
        y1 += ((y2 - y1) * (left - x1)) / (x2 - x1);
        x1 = left;
      } else if (isMask(1, ocu1)) {
        // clip above
        x1 += ((x2 - x1) * (top - y1)) / (y2 - y1);
        y1 = top;
      } else if (isMask(2, ocu1)) {
        // clip right
        y1 += ((y2 - y1) * (right - x1)) / (x2 - x1);
        x1 = right;
      } else if (isMask(3, ocu1)) {
        // clip below
        x1 += ((x2 - x1) * (bottom - y1)) / (y2 - y1);
        y1 = bottom;
      }
      ocu1 = makeOutcodes(x1, y1);
      inside = (ocu1 | ocu2) === 0; // update
      outside = (ocu1 & ocu2) !== 0; //  4-bit codes
    }
    const p1 = new Point(x1, y1);
    const p2 = new Point(x2, y2);
    return { inside, a: isSwap ? p2 : p1, b: isSwap ? p1 : p2 };
  }
}

const mkMask = (pos: 0 | 1 | 2 | 3, val: boolean): number =>
  val ? 1 << pos : 0;

const isMask = (pos: 0 | 1 | 2 | 3, code: number): boolean =>
  !!(code & (1 << pos));

export const updateRect = (pt: Point, srcRect?: Rect): Rect => {
  if (!srcRect) return new Rect(pt, pt);
  srcRect.updatePoint(pt);
  return srcRect;
};
