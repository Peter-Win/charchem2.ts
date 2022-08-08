import { Point } from "../../math/Point";
import { Rect, updateRect } from "../../math/Rect";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { PathSeg } from "../path";
import { tracePath } from "../utils/tracePath";
import { Figure } from "./Figure";

export class FigPath extends Figure {
  constructor(public segs: PathSeg[], public style: PathStyle) {
    super();
  }

  update() {
    let rc: Rect | undefined;
    tracePath(this.segs, {
      onM(p) {
        rc = updateRect(p, rc);
      },
      onL(p) {
        rc = updateRect(p, rc);
      },
      onC(cp1, cp2, p) {
        rc = updateRect(p, rc);
        rc.updatePoint(cp1);
        rc.updatePoint(cp2);
      },
      onQ(cp, p) {
        rc = updateRect(p, rc);
        rc.updatePoint(cp);
      },
      onA(r, xRot, largeArc, sweep, pt) {
        rc = updateRect(pt, rc);
      },
    });
    this.bounds = rc ?? new Rect();
  }

  draw(offset: Point, surface: AbstractSurface): void {
    surface.drawPath(offset.plus(this.org), this.segs, this.style);
  }
}

export const createLine = (a: Point, b: Point, style: PathStyle): FigPath =>
  new FigPath(
    [
      { cmd: "M", pt: a },
      { cmd: "L", pt: b },
    ],
    style
  );
