import { updateRect } from "../../math/Rect";
import { Point } from "../../math/Point";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { PathSeg } from "../path";
import { Figure } from "./Figure";

export class FigLine extends Figure {
  constructor(
    public readonly a: Point,
    public readonly b: Point,
    public readonly style: PathStyle
  ) {
    super();
    this.update();
  }

  update(): void {
    this.bounds = updateRect(this.a, updateRect(this.b));
  }

  draw(offset: Point, surface: AbstractSurface): void {
    const path: PathSeg[] = [
      { cmd: "M", pt: this.a },
      { cmd: "L", pt: this.b },
    ];
    surface.drawPath(offset.plus(this.org), path, this.style);
  }
}
