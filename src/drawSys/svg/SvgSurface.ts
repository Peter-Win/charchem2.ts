import { Point } from "../../math/Point";
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

const pathAttrs = (style: PathStyle, org?: Point) => {
  const attrs: XmlAttrs = {};
  attrs.fill = style.fill ?? "none";
  if (style.stroke) {
    attrs.stroke = style.stroke;
    if (style.strokeWidth) attrs["stroke-width"] = toa(style.strokeWidth);
  }
  if (org && !org.isZero())
    attrs.transform = `translate(${toa(org.x)},${toa(org.y)})`;
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
  }

  drawPath(org: Point, path: PathSeg[], style: PathStyle): void {
    const attrs: XmlAttrs = { d: pathToString(path), ...pathAttrs(style, org) };
    this.body.push(`${drawTag("path", attrs, true)}`);
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
    this.body.push(`${drawTag("ellipse", attrs, true)}`);
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

  private size: Point = new Point();

  defs: Record<string, string> = {};

  body: string[] = [];
}
