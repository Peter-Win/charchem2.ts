import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { Figure } from "./Figure";

export class FigEllipse extends Figure {
  constructor(
    center: Point,
    public readonly radius: Point,
    public readonly style: PathStyle
  ) {
    super();
    this.org = center;
    this.bounds = new Rect(radius.neg(), radius);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  update(): void {}

  draw(offset: Point, surface: AbstractSurface): void {
    surface.drawEllipse(offset, this.org, this.radius, this.style);
  }
}
