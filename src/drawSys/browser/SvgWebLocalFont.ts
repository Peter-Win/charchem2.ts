import { Point } from "../../math/Point";
import {
  AbstractSurface,
  LocalFont,
  LocalFontProps,
  TextStyle,
} from "../AbstractSurface";
import { CommonFontFace } from "../CommonFontFace";
import { WebFontProps } from "./WebFontProps";
import { SvgWebSurface } from "./SvgWebSurface";
import { drawTag } from "../../utils/xml/drawTag";
import { escapeXml } from "../../utils/xml/escapeXml";
import { XmlAttrs } from "../../utils/xml/xmlTypes";
import { toa } from "../../math";

export class SvgWebLocalFont implements LocalFont {
  private canvas: HTMLCanvasElement;

  constructor(
    private webFontProps: WebFontProps,
    public readonly props: LocalFontProps,
  ) {
    this.canvas = document.createElement("canvas");
  }

  getFontFace(): CommonFontFace {
    return this.webFontProps.fontFace;
  }

  getTextWidth(textLine: string): number {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw Error("Canvas don't supported");
    ctx.font = this.webFontProps.canvasFont;
    return ctx.measureText(textLine).width;
  }

  drawLine(
    surface: AbstractSurface,
    org: Point,
    textLine: string,
    style: TextStyle,
  ): void {
    if (surface instanceof SvgWebSurface) {
      const { fontFace, cssHeight, bold, italic } = this.webFontProps;
      const props: XmlAttrs = {
        fill: style.fill,
        "font-family": fontFace.fontFamily,
        "font-size": `${cssHeight}px`,
      };
      if (bold) props["font-weight"] = "bold";
      if (italic) props["font-style"] = "italic";
      const stylesList: string[] = [];

      if (style.underline) {
        stylesList.push("underline");
      }
      if (style.overline) {
        stylesList.push("overline");
      }
      if (stylesList.length > 0) {
        props["text-decoration"] = stylesList.join(" ");
      }
      const attrs: XmlAttrs = {
        x: toa(org.x),
        y: toa(org.y),
        ...surface.makeNodeAttrs(props),
      };

      // Необходимо заменить пробелы. Иначе происходит схлопывание первого пробела и двойных пробелов. Т.е "_a__b" выглядит как "a_b"
      const encodedText = escapeXml(textLine).replace(/ /g, "&nbsp;");
      const code = `${drawTag("text", attrs)}${encodedText}</text>`;
      surface.addFigure(code);
    } else {
      throw new Error("Expected SvgWebSurface");
    }
  }
}
