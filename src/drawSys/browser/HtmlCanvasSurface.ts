import { Point } from "../../math/Point";
import {
  AbstractSurface,
  LocalFont,
  LocalFontProps,
  PathStyle,
} from "../AbstractSurface";
import { PathSeg, PathVisitor } from "../path";
import { tracePath } from "../utils/tracePath";
import { WebFontCache } from "./WebFontCache";
import { HtmlCanvasLocalFont } from "./HtmlCanvasLocalFont";
import { Matrix2x3 } from "../../math/Matrix2x3";

export class HtmlCanvasSurface implements AbstractSurface {
  private domElement: HTMLCanvasElement;

  private size: Point;

  private htmlContext: CanvasRenderingContext2D;

  private fontPropsCache: WebFontCache;

  private fontCache: Record<string, LocalFont> = {};

  getCanvas() {
    return this.domElement;
  }

  getCtx() {
    return this.htmlContext;
  }

  constructor(domElement: HTMLCanvasElement, fontPropsCache?: WebFontCache) {
    this.domElement = domElement;
    const ctx = domElement.getContext("2d");
    if (!ctx) throw Error("2d context is not supported");
    this.htmlContext = ctx;
    this.size = new Point();
    this.fontPropsCache = fontPropsCache ?? new WebFontCache();
  }

  getFont(props: LocalFontProps): LocalFont {
    const webProps = this.fontPropsCache.getWebProps(props);
    let font = this.fontCache[webProps.hash];
    if (font) return font;
    font = new HtmlCanvasLocalFont(this.getCtx(), webProps);
    this.fontCache[webProps.hash] = font;
    return font;
  }

  applyStyle(style: PathStyle, org?: Point | Matrix2x3) {
    const { htmlContext } = this;
    if (org) {
      if (org instanceof Point) {
        htmlContext.translate(org.x, org.y);
      } else if (org instanceof Matrix2x3) {
        const { a, b, c, d, e, f } = org;
        htmlContext.transform(a, b, c, d, e, f);
      }
    }
    htmlContext.beginPath();
    htmlContext.fillStyle = style.fill ?? "transparent";
    htmlContext.strokeStyle = style.stroke ?? "transparent";
    htmlContext.lineWidth = style.strokeWidth ?? 1;
  }

  drawPath(
    org: Point | Matrix2x3,
    segments: PathSeg[],
    style: PathStyle
  ): void {
    const { htmlContext } = this;
    htmlContext.save();
    this.applyStyle(style, org);

    const visitor: PathVisitor = {
      onM(p: Point) {
        htmlContext.moveTo(p.x, p.y);
      },
      onL(p: Point) {
        htmlContext.lineTo(p.x, p.y);
      },
      onQ(cp: Point, p: Point) {
        htmlContext.quadraticCurveTo(cp.x, cp.y, p.x, p.y);
      },
      onC(cp1: Point, cp2: Point, p: Point) {
        htmlContext.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
      },
      onA(r, xRot, largeArc, sweep, pt) {
        // Точного соответствия нет. Нужно комбинировать arcTo и трансформации
        htmlContext.lineTo(pt.x, pt.y);
      },
    };
    tracePath(segments, visitor);
    if (style.fill) htmlContext.fill();
    if (style.stroke) htmlContext.stroke();
    htmlContext.restore();
  }

  drawEllipse(
    offset: Point,
    center: Point,
    radius: Point,
    style: PathStyle
  ): void {
    const { htmlContext } = this;
    htmlContext.save();
    this.applyStyle(style, offset);
    htmlContext.ellipse(
      center.x,
      center.y,
      radius.x,
      radius.y,
      0,
      0,
      2 * Math.PI
    );
    if (style.fill) htmlContext.fill();
    if (style.stroke) htmlContext.stroke();
    htmlContext.restore();
  }

  setSize(size: Point) {
    this.size = size;
    this.domElement.width = size.x;
    this.domElement.height = size.y;
  }
}
