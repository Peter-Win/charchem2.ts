import { Point } from "../../math/Point";
import { AbstractSurface, LocalFont, TextStyle } from "../AbstractSurface";
import { CommonFontFace } from "../CommonFontFace";
import { WebFontProps } from "./WebFontProps";

export class HtmlCanvasLocalFont implements LocalFont {
  private context: CanvasRenderingContext2D;

  private props: WebFontProps;

  constructor(context: CanvasRenderingContext2D, props: WebFontProps) {
    this.context = context;
    this.props = props;
  }

  getFontFace(): CommonFontFace {
    return this.props.fontFace;
  }

  getTextWidth(textLine: string): number {
    this.context.font = this.props.canvasFont;
    const m = this.context.measureText(textLine);
    return m.width;
  }

  drawLine(
    surface: AbstractSurface,
    org: Point,
    textLine: string,
    style: TextStyle
  ) {
    this.context.font = this.props.canvasFont;
    this.context.fillStyle = style.fill;
    this.context.fillText(textLine, org.x, org.y);
  }
}
