import { Point } from "../math/Point";
import { Rect } from "../math/Rect";
import { FontWeight, FontStyle, FontStretch } from "./FontTypes";
import { CommonFontFace } from "./CommonFontFace";
import { PathSeg } from "./path";

// see SVG stroke-linejoin
export type LineJoinShape = "arcs" | "bevel" | "miter" | "miter-clip" | "round";

// see SVG stroke-linecap
export type LineCapShape = "butt" | "round" | "square";

export interface PathStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  join?: LineJoinShape;
  cap?: LineCapShape;
}

export interface LocalFontProps {
  family: string; // Possible list with comma from highest priority to lowest. Special values: serif, sans-serif
  height: number; // specific for platform. For example, In CSS height corresponds to the value of the ascent.
  // but in common case height = ascent - descent
  weight?: FontWeight;
  style?: FontStyle;
  stretch?: FontStretch;
}

export interface TextStyle {
  fill: string;
}

export interface LocalFont {
  getFontFace(): CommonFontFace;
  getTextWidth(textLine: string): number;
  drawLine(
    surface: AbstractSurface,
    org: Point, // org.y relative to the baseline of the font
    textLine: string,
    style: TextStyle
  ): void;
  createScaled?(scale: number): LocalFont;
}

export interface AbstractSurface {
  getFont(props: LocalFontProps): LocalFont;
  drawPath(org: Point, path: PathSeg[], style: PathStyle): void;
  drawEllipse(
    offset: Point,
    center: Point,
    radius: Point,
    style: PathStyle
  ): void;
  drawRect?(offset: Point, rect: Rect, style: PathStyle, radius?: Point): void;
  setSize(size: Point): void;
}
