/**
 * Rectangle object
 * Created by PeterWin
 * ver 1.1 on 26.04.2017
 * ver 2.0 on 30.05.2022
 */
import { Point } from "./Point";
import { Double } from "../types";
import { toa } from "./index";

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

  toString() {
    return `{${toa(this.left)}, ${toa(this.top)}, ${toa(this.right)}, ${toa(
      this.bottom
    )}}`;
  }

  clone(): Rect {
    return new Rect(this.A, this.B);
  }
}
