import { Point } from "../../math/Point";
import { AbstractSurface, LocalFont, TextStyle } from "../AbstractSurface";
import { Figure } from "./Figure";
import { getBaseline, getFontHeight } from "../utils/fontFaceProps";

export class FigText extends Figure {
  constructor(
    public readonly text: string,
    public readonly font: LocalFont,
    public readonly style: TextStyle
  ) {
    super();
    const ff = font.getFontFace();
    const height = getFontHeight(ff);
    const baseLine = getBaseline(ff);
    this.bounds.A.y = -baseLine;
    this.bounds.B.y = height - baseLine;
    this.bounds.B.x = font.getTextWidth(text);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  update(): void {}

  draw(offset: Point, surface: AbstractSurface): void {
    this.font.drawLine(surface, offset.plus(this.org), this.text, this.style);
  }
}
