import { Point } from "../math/Point";
import { Rect } from "../math/Rect";
import { FontWeight, FontStyle, FontStretch } from "./FontTypes";
import { CommonFontFace } from "./CommonFontFace";
import { PathSeg } from "./path";
import { Matrix2x3 } from "../math/Matrix2x3";

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

export type ParamsDrawGlyph = {
  transform: Matrix2x3;
  glyphId: string;
  style: TextStyle;
  getPath(): PathSeg[];
};

export interface AbstractSurface {
  setSize(size: Point): void;
  getFont(props: LocalFontProps): LocalFont;
  drawPath(org: Point | Matrix2x3, path: PathSeg[], style: PathStyle): void;
  drawEllipse(
    offset: Point,
    center: Point,
    radius: Point,
    style: PathStyle
  ): void;
  drawRect?(offset: Point, rect: Rect, style: PathStyle, radius?: Point): void;
  drawGlyph?(params: ParamsDrawGlyph): void;
}

/**
 * Portable surfaces cannot use text functions directly.
 * Because when constructing a formula, we need to know the exact boundaries of the characters in order to correctly attach chemical bonds to text nodes.
 * Therefore, instead of text functions, glyphs implemented using paths are used.
 * But for optimization, it is recommended to cache glyphs by their identifiers.
 */
export const drawGlyph = (
  surface: AbstractSurface,
  params: ParamsDrawGlyph
) => {
  if (surface.drawGlyph) {
    surface.drawGlyph(params);
  } else {
    // If the surface does not support a special method, then a less efficient path-based output option is used.
    surface.drawPath(params.transform, params.getPath(), params.style);
  }
};
