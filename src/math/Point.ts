import { toa, is0 } from "./index";
import { Double } from "../types";
import { deg2rad, rad2deg } from "./radians";

export const pointFromRad = (angle: Double): Point =>
  new Point(Math.cos(angle), Math.sin(angle));

export const pointFromDeg = (angle: Double): Point =>
  pointFromRad(deg2rad(angle));

export class Point {
  x: Double;

  y: Double;

  constructor(x: Double = 0.0, y: Double = 0.0) {
    this.x = x;
    this.y = y;
  }

  set(x: Double, y: Double): void {
    this.x = x;
    this.y = y;
  }

  setPt(src: Point): void {
    this.x = src.x;
    this.y = src.y;
  }

  toString(): string {
    return `(${toa(this.x)}, ${toa(this.y)})`;
  }

  clone(): Point {
    return new Point(this.x, this.y);
  }

  // Operator p == p
  equals(other: Point): boolean {
    return is0(this.x - other.x) && is0(this.y - other.y);
  }

  isZero(): boolean {
    return is0(this.x) && is0(this.y);
  }

  // Operator p + p
  plus(pt: Point): Point {
    return new Point(this.x + pt.x, this.y + pt.y);
  }

  add(deltaX: Double, deltaY: Double): this {
    this.x += deltaX;
    this.y += deltaY;
    return this;
  }

  iadd(pt: Point): this {
    this.x += pt.x;
    this.y += pt.y;
    return this;
  }

  isub(pt: Point): this {
    this.x -= pt.x;
    this.y -= pt.y;
    return this;
  }

  // Operator p - p
  minus(pt: Point): Point {
    return new Point(this.x - pt.x, this.y - pt.y);
  }

  neg(): Point {
    return new Point(-this.x, -this.y);
  }

  // Operator p * k
  times(k: Double): Point {
    return new Point(k * this.x, k * this.y);
  }

  scale(k: Double): this {
    this.x *= k;
    this.y *= k;
    return this;
  }

  mini(pt: Point): void {
    this.x = Math.min(this.x, pt.x);
    this.y = Math.min(this.y, pt.y);
  }

  maxi(pt: Point): void {
    this.x = Math.max(this.x, pt.x);
    this.y = Math.max(this.y, pt.y);
  }

  polarAngle(): Double {
    if (is0(this.x) && is0(this.y)) {
      return 0.0;
    }
    if (is0(this.x)) {
      return this.y > 0.0 ? Math.PI / 2.0 : -Math.PI / 2.0;
    }
    return Math.atan2(this.y, this.x);
  }

  polarAngleDeg(): Double {
    return rad2deg(this.polarAngle());
  }

  // Square of length
  lengthSqr(): Double {
    return this.x * this.x + this.y * this.y;
  }

  length(): Double {
    return Math.sqrt(this.lengthSqr());
  }

  distSqr(p: Point): Double {
    return p.minus(this).lengthSqr();
  }

  dist(p: Point): Double {
    return Math.sqrt(this.distSqr(p));
  }

  normal(): Point {
    const len = this.length();
    return is0(len) ? new Point() : this.times(1 / len);
  }

  transpon(ccw?: boolean): Point {
    return ccw ? new Point(this.y, -this.x) : new Point(-this.y, this.x);
  }

  static get zero() {
    return staticZero;
  }
}

const staticZero = Object.freeze(new Point());
