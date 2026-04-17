import { Point } from "../../math/Point";
import {
  AbstractSurface,
  LocalFont,
  LocalFontProps,
  TextStyle,
} from "../AbstractSurface";
import { CommonFontFace } from "../CommonFontFace";
import { WebFontProps } from "./WebFontProps";

export class HtmlCanvasLocalFont implements LocalFont {
  constructor(
    private context: CanvasRenderingContext2D,
    private readonly webProps: WebFontProps,
    public readonly props: LocalFontProps
  ) {}

  getFontFace(): CommonFontFace {
    return this.webProps.fontFace;
  }

  getTextWidth(textLine: string): number {
    this.context.font = this.webProps.canvasFont;
    const m = this.context.measureText(textLine);
    return m.width;
  }

  drawLine(
    surface: AbstractSurface,
    org: Point,
    textLine: string,
    style: TextStyle
  ) {
    const { context } = this;
    const { x, y } = org;
    context.font = this.webProps.canvasFont;
    context.fillStyle = style.fill;
    context.fillText(textLine, x, y);

    if (style.underline || style.overline) {
      // TODO: неплохо бы задействовать параметры underlineThickness и underlinePosition из this.webProps.fontFace
      const textMetrics = context.measureText(textLine);
      context.strokeStyle = style.fill;
      const lineWidth = this.webProps.cssHeight / 16;
      context.lineWidth = lineWidth;
      if (style.underline) {
        const underY = y + 2 * lineWidth;
        context.beginPath();
        context.moveTo(x, underY);
        context.lineTo(x + textMetrics.width, underY);
        context.stroke();
      }
      if (style.overline) {
        const overY = y - this.getFontFace().ascent - lineWidth;
        context.beginPath();
        context.moveTo(x, overY);
        context.lineTo(x + textMetrics.width, overY);
        context.stroke();
      }
    }
  }
}
