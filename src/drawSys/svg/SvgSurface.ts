import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import {
  AbstractSurface,
  LocalFont,
  LocalFontProps,
  PathStyle,
} from "../AbstractSurface";
import { buildSvgText } from "./svgUtils/buildSvgText";
import { SvgExportOptions } from "./SvgExportOptions";
import { drawTag } from "../../utils/xml/drawTag";
import { toa } from "../../math";
import { PathSeg } from "../path";
import { pathToString } from "../utils/pathToString";
import { XmlAttrs } from "../../utils/xml/xmlTypes";
import { Matrix2x3 } from "../../math/Matrix2x3";

const pathAttrs = (style: PathStyle, org?: Point | Matrix2x3) => {
  const { stroke, strokeWidth, join, cap } = style;
  const attrs: XmlAttrs = {};
  attrs.fill = style.fill ?? "none";
  if (stroke) {
    attrs.stroke = stroke;
  }
  if (strokeWidth) attrs["stroke-width"] = toa(strokeWidth);
  if (join) attrs["stroke-linecap"] = join;
  if (cap) attrs["stroke-linecap"] = cap;
  if (org) {
    if (org instanceof Point && !org.isZero()) {
      attrs.transform = `translate(${toa(org.x)},${toa(org.y)})`;
    } else if (org instanceof Matrix2x3) {
      attrs.transform = `matrix(${org.repr()})`;
    }
  }
  return attrs;
};

/**
 * SvgSurface can be used for Node and Browser.
 * But it is recommended to use different font systems for each of the platforms.
 */
export abstract class SvgSurface implements AbstractSurface {
  abstract getFont(props: LocalFontProps): LocalFont;

  // Parent overrides

  setSize(size: Point) {
    this.size = size.clone();
    this.clear();
  }

  drawPath(org: Point | Matrix2x3, path: PathSeg[], style: PathStyle): void {
    const attrs: XmlAttrs = { d: pathToString(path), ...pathAttrs(style, org) };
    this.addFigure(drawTag("path", attrs, true));
  }

  drawRect(offset: Point, rect: Rect, style: PathStyle, radius?: Point) {
    const attrs: XmlAttrs = {
      x: toa(rect.left),
      y: toa(rect.top),
      width: toa(rect.width),
      height: toa(rect.height),
      ...pathAttrs(style, offset),
    };
    if (radius) {
      attrs.rx = toa(radius.x);
      attrs.ry = toa(radius.y);
    }
    this.addFigure(drawTag("rect", attrs, true));
  }

  drawEllipse(
    offset: Point,
    center: Point,
    radius: Point,
    style: PathStyle
  ): void {
    const attrs: XmlAttrs = {
      ...pathAttrs(style, offset),
      cx: toa(center.x),
      cy: toa(center.y),
      rx: toa(radius.x),
      ry: toa(radius.y),
    };
    this.addFigure(`${drawTag("ellipse", attrs, true)}`);
  }

  // Svg specific

  addFigure(xmlCode: string) {
    this.body.push(xmlCode);
  }

  addDef(id: string, value: string) {
    this.defs[id] = value;
  }

  exportText(options?: SvgExportOptions): string {
    return buildSvgText(this.size, this.defs, this.body, options ?? {});
  }

  clear() {
    this.defs = {};
    this.body.length = 0;
  }

  private size: Point = new Point();

  defs: Record<string, string> = {};

  body: string[] = [];
}
