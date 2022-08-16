import { is0 } from "../../math";
import { Rect } from "../../math/Rect";
import { Point } from "../../math/Point";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { PathSeg } from "../path";
import { Figure } from "./Figure";

/**
 *   b      c
 *    ######
 *
 *     ####
 *
 *      ##
 *      a
 * Отдельная фигура позволит менять алгоритм вывода, в зависимости от поверхности.
 * Т.к. в старых реализациях не удалось обеспечить качественное изображение при малых размерах.
 */

export class FigHashTriangle extends Figure {
  constructor(
    public readonly a: Point,
    public readonly b: Point,
    public readonly c: Point,
    public readonly color: string,
    public readonly lineWidth: number
  ) {
    super();
  }

  update(): void {
    this.bounds = new Rect(this.a, this.b);
    this.bounds.updatePoint(this.c);
  }

  draw(offset: Point, surface: AbstractSurface): void {
    // Пока еще нет специальных функций поверхности для вывода полосатого треугольника
    const { a, b, c, color, lineWidth } = this;
    const { segs, style } = makeHashTrianglePath(a, b, c, lineWidth, color);
    if (segs.length > 0) {
      surface.drawPath(this.org.plus(offset), segs, style);
    }
  }
}

export const makeHashTrianglePath = (
  a: Point,
  b: Point,
  c: Point,
  lineWidth: number,
  color: string
) => {
  // Алгоритм, дающий качественное изображение на больших размерах. Использует заливку.
  // Нужно разделить ось на нечетное количество равных отрезков.
  // Ширина полоски равна расстоянию между полосками и не меньше lineWidth
  // Полоски создаются закрашенными трапециями.
  const segs: PathSeg[] = [];
  const style: PathStyle = { fill: color };

  const dst = b.plus(c).times(0.5);

  const maxW = c.minus(b).length() / 2;
  const minW = lineWidth / 2;
  const dW = maxW - minW;
  const dir = dst.minus(a);
  const len = dir.length();
  const dir1 = dir.normal();
  const dL = dir1.transpon(true);
  const dR = dir1.transpon();
  if (!is0(len)) {
    let stripCount = Math.floor(len / lineWidth);
    // если четное число, то уменьшить - ширина полос немного увеличится
    // eslint-disable-next-line no-bitwise
    if ((stripCount & 1) === 0) stripCount--;
    for (let i = 0; i < stripCount; i += 2) {
      const t1 = i / stripCount;
      const t2 = (i + 1) / stripCount;
      const p0 = a.plus(dir.times(t1));
      const p1 = a.plus(dir.times(t2));
      const w1 = minW + (i * dW) / stripCount;
      const w2 = minW + ((i + 1) * dW) / stripCount;
      const p0L = p0.plus(dL.times(w1));
      const p0R = p0.plus(dR.times(w1));
      const p1L = p1.plus(dL.times(w2));
      const p1R = p1.plus(dR.times(w2));
      segs.push({ cmd: "M", pt: p0L });
      segs.push({ cmd: "L", pt: p1L });
      segs.push({ cmd: "L", pt: p1R });
      segs.push({ cmd: "L", pt: p0R });
    }
  }
  return { segs, style };
};
