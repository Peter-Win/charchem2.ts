import { Point } from "../../math/Point";
import { AbstractSurface, LocalFont, TextStyle } from "../AbstractSurface";
import { CommonFontFace } from "../CommonFontFace";
import { WebFontProps } from "./WebFontProps";
import { SvgWebSurface } from "./SvgWebSurface";
import { drawTag } from "../../utils/xml/drawTag";
import { escapeXml } from "../../utils/xml/escapeXml";
import { XmlAttrs } from "../../utils/xml/xmlTypes";
import { toa } from "../../math";

export class SvgWebLocalFont implements LocalFont {
  private canvas: HTMLCanvasElement;

  constructor(private webFontProps: WebFontProps) {
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
    style: TextStyle
  ): void {
    if (surface instanceof SvgWebSurface) {
      const { fontFace, cssHeight, bold, italic } = this.webFontProps;
      const attrs: XmlAttrs = {
        x: toa(org.x),
        y: toa(org.y),
        fill: style.fill,
        "font-family": fontFace.fontFamily,
        "font-size": `${cssHeight}px`,
      };
      if (bold) attrs["font-weight"] = "bold";
      if (italic) attrs["font-style"] = "italic";
      const code = `${drawTag("text", attrs)}${escapeXml(textLine)}</text>`;
      surface.addFigure(code);
    } else {
      throw new Error("Expected SvgWebSurface");
    }
  }
}
