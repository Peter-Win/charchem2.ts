import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import { AbstractSurface } from "../AbstractSurface";

export abstract class Figure {
  bounds: Rect;

  org: Point;

  constructor() {
    this.bounds = new Rect();
    this.org = new Point();
  }

  abstract update(): void;

  abstract draw(offset: Point, surface: AbstractSurface): void;

  getRelativeBounds(): Rect {
    const rc = this.bounds.clone();
    rc.move(this.org);
    return rc;
  }
}
