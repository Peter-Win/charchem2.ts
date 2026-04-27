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
    style: PathStyle,
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
    const { size, defs, body, classesMap } = this;
    return buildSvgText({
      size,
      classes: Object.values(classesMap),
      defs,
      body,
      options,
    });
  }

  classByProps(props: XmlAttrs): string {
    const key = JSON.stringify(props);
    const cached = this.classesMap[key];
    if (cached) return cached.name;
    const className = `style-${this.getSalt()}-${
      Object.values(this.classesMap).length + 1
    }`;
    const item: SvgClsItem = {
      name: className,
      props,
    };
    this.classesMap[key] = item;
    return item.name;
  }

  salt?: string;

  getSalt(): string {
    if (this.salt !== undefined) {
      return this.salt;
    }
    const salt = Math.floor(Math.random() * 36 ** 5).toString(36);
    this.salt = salt;
    return salt;
  }

  makeNodeAttrs(props: XmlAttrs): XmlAttrs {
    // Если на странице появляется несколько svg-изображений с одинаковыми классами в блоке style,
    // то они применяются не только к своим узлам, но и к узлам других изображений.
    // Например, есть два svg. В одном .style-1 {fill: "blue"}, а в другом .style-1 {font-weight: bold}
    // В результате все узлы с class="style-1" будут и синими, и жирными.
    // Поэтому нужно либо успользовать уникальные имена классов, либо выводить пропсы не через класс, а inline
    // Однако, не все свойства класса можно вставить в узел. Например, text-decoration работает только в классе.

    // Текущая реализация предполагает использования случайно генерируемой соли.
    return { class: this.classByProps(props) };
  }

  clear() {
    this.defs = {};
    this.body.length = 0;
  }

  private size: Point = new Point();

  defs: Record<string, string> = {};

  classesMap: Record<string, SvgClsItem> = {};

  body: string[] = [];
}

export type SvgClsItem = {
  name: string;
  props: XmlAttrs;
};
