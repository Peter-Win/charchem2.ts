/**
 * Rectangle object
 * Created by PeterWin
 * ver 1.1 on 26.04.2017
 * ver 2.0 on 30.05.2022
 */
import { Point } from "./Point";
import { Double } from "../types";
import { is0, toa } from "./index";

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
}

export const updateRect = (pt: Point, srcRect?: Rect): Rect => {
  if (!srcRect) return new Rect(pt, pt);
  srcRect.updatePoint(pt);
  return srcRect;
};
