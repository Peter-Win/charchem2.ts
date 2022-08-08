import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import { AbstractSurface } from "../AbstractSurface";
import { Figure } from "./Figure";

export class FigFrame extends Figure {
  figures: Figure[] = [];

  addFigure(fig: Figure, update?: boolean) {
    this.figures.push(fig);
    if (update) this.updateFigure(fig);
  }

  insertFigure(pos: number, fig: Figure, update?: boolean) {
    this.figures.splice(pos, 0, fig);
    if (update) this.updateFigure(fig);
  }

  updateFigure(fig: Figure) {
    this.bounds.unite(fig.getRelativeBounds());
  }

  update(): void {
    this.bounds =
      this.figures.reduce((acc: Rect | undefined, fig: Figure) => {
        const figBounds = fig.getRelativeBounds();
        if (!acc) {
          return figBounds;
        }
        acc.unite(figBounds);
        return acc;
      }, undefined) ?? new Rect();
  }

  draw(offset: Point, surface: AbstractSurface): void {
    const org = offset.plus(this.org);
    this.figures.forEach((fig) => fig.draw(org, surface));
  }
}
