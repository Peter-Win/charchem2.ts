import { Double } from "../types";
import { Point } from "../math/Point";

export interface PathSegPt {
  cmd: "M" | "L" | "T";
  rel?: boolean;
  pt: Point;
}

export interface PathSegVert {
  cmd: "V";
  rel?: boolean;
  y: Double;
}

export interface PathSegHoriz {
  cmd: "H";
  rel?: boolean;
  x: Double;
}

export interface PathSegCubic {
  cmd: "Q";
  rel?: boolean;
  cp: Point;
  pt: Point;
}

export interface PathSegBezier {
  cmd: "C";
  rel?: boolean;
  cp1: Point;
  cp2: Point;
  pt: Point;
}

export interface PathSegBezierShort {
  cmd: "S";
  rel?: boolean;
  cp2: Point;
  pt: Point;
}

// see: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#arcs
export interface PathSegArc {
  cmd: "A";
  rel?: boolean;
  r: Point;
  xRot: number; // in degrees
  largeArc: 0 | 1;
  sweep: 0 | 1;
  pt: Point;
}

export interface PathSegZ {
  cmd: "Z" | "z";
  rel?: boolean;
}

export type PathSeg =
  | PathSegPt
  | PathSegVert
  | PathSegHoriz
  | PathSegCubic
  | PathSegBezier
  | PathSegBezierShort
  | PathSegArc
  | PathSegZ;

export interface PathVisitor {
  onZ?(p: Point): void;
  onM(p: Point): void;
  onL(p: Point): void;
  onH?(p: Point): void;
  onV?(p: Point): void;
  onC(cp1: Point, cp2: Point, p: Point): void;
  onQ(cp: Point, p: Point): void;
  onA(r: Point, xRot: number, largeArc: 0 | 1, sweep: 0 | 1, pt: Point): void;
}
