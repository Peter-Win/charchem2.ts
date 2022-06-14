import { toa } from "./index";
import { Double } from "../types";
import { Point } from "./Point";
import { deg2rad } from "./radians";

//              a       b       c       d       e       f
type Double6 = [Double, Double, Double, Double, Double, Double];

// eslint-disable-next-line no-shadow
const enum Index6 {
  a,
  b,
  c,
  d,
  e,
  f,
}

/**
 *  ┌ a c e ┐
 *  │ b d f │
 *  └ 0 0 1 ┘
 *
 */
export class Matrix2x3 {
  m: Double6;

  constructor(m?: Double6) {
    this.m = m ?? [0, 0, 0, 0, 0, 0];
  }

  clone(): Matrix2x3 {
    return new Matrix2x3([...this.m]);
  }

  // Human readable string representation
  toString() {
    return this.m.map((value) => toa(value)).join(" ");
  }

  // String representation without loss of precision.
  // Useful for generating css and svg transformation attributes.
  // Similar to the Python language.
  repr(divider: string = " ") {
    return this.m.join(divider);
  }

  static createIdentity(): Matrix2x3 {
    return new Matrix2x3([1, 0, 0, 1, 0, 0]);
  }

  static createZero(): Matrix2x3 {
    return new Matrix2x3([0, 0, 0, 0, 0, 0]);
  }

  translate(pt: Point): void;

  translate(dx: Double, dy: Double): void;

  translate(a: Point | Double, b?: Double) {
    if (a instanceof Point) {
      this.m[Index6.e] += a.x;
      this.m[Index6.f] += a.y;
    } else if (typeof a === "number" && typeof b === "number") {
      this.m[Index6.e] += a;
      this.m[Index6.f] += b;
    }
  }

  moveX(x: Double) {
    this.m[Index6.e] += x;
  }

  moveY(y: Double) {
    this.m[Index6.f] += y;
  }

  scale(k: Double, ky?: Double) {
    this.m[Index6.a] *= k;
    this.m[Index6.d] *= ky ?? k;
    this.m[Index6.e] *= k;
    this.m[Index6.f] *= ky ?? k;
  }

  scaleX(kx: Double) {
    this.m[Index6.a] *= kx;
  }

  scaleY(ky: Double) {
    this.m[Index6.d] *= ky;
  }

  rotate(radians: Double) {
    const cosA = Math.cos(radians);
    const sinA = Math.sin(radians);
    this.m[Index6.a] = cosA;
    this.m[Index6.b] = sinA;
    this.m[Index6.c] = -sinA;
    this.m[Index6.d] = cosA;
  }

  rotateDeg(degrees: Double) {
    this.rotate(deg2rad(degrees));
  }

  apply(pt: Point): Point {
    return new Point(
      this.a * pt.x + this.c * pt.y + this.e,
      this.b * pt.x + this.d * pt.y + this.f
    );
  }

  get a(): Double {
    return this.m[Index6.a];
  }

  set a(value: Double) {
    this.m[Index6.a] = value;
  }

  get b(): Double {
    return this.m[Index6.b];
  }

  set b(value: Double) {
    this.m[Index6.b] = value;
  }

  get c(): Double {
    return this.m[Index6.c];
  }

  set c(value: Double) {
    this.m[Index6.c] = value;
  }

  get d(): Double {
    return this.m[Index6.d];
  }

  set d(value: Double) {
    this.m[Index6.d] = value;
  }

  get e(): Double {
    return this.m[Index6.e];
  }

  set e(value: Double) {
    this.m[Index6.e] = value;
  }

  get f(): Double {
    return this.m[Index6.f];
  }

  set f(value: Double) {
    this.m[Index6.f] = value;
  }
}
