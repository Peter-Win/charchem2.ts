import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { drawRect } from "./drawRect";
import { Figure } from "./Figure";

export class FigRect extends Figure {
  readonly radius?: Point;

  constructor(rect: Rect, public readonly style: PathStyle, radius?: Point) {
    super();
    this.bounds = rect.clone();
    this.radius = radius;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  update(): void {}

  draw(offset: Point, surface: AbstractSurface): void {
    drawRect(
      surface,
      offset.plus(this.org),
      this.bounds,
      this.style,
      this.radius
    );
  }
}
