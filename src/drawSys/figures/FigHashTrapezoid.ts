import { is0 } from "../../math";
import { Rect } from "../../math/Rect";
import { Point } from "../../math/Point";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { PathSeg } from "../path";
import { Figure } from "./Figure";

/**
 *      b
 *    ######  bWidth
 *
 *     ####
 *
 *      ##  aWidth
 *      a
 * Отдельная фигура позволит менять алгоритм вывода, в зависимости от поверхности.
 * Т.к. в старых реализациях не удалось обеспечить качественное изображение при малых размерах.
 */

export class FigHashTrapezoid extends Figure {
  constructor(
    public readonly a: Point,
    public readonly aWidth: number,
    public readonly b: Point,
    public readonly bWidth: number,
    public readonly color: string,
    public readonly lineWidth: number
  ) {
    super();
  }

  update(): void {
    const { a, aWidth, b, bWidth } = this;
    const { dL, dR } = calcTrapezoidDir(a, b);
    const { aL, aR, bL, bR } = calcTrapezoidPoints(
      a,
      aWidth,
      b,
      bWidth,
      dL,
      dR
    );
    this.bounds = new Rect(aL, aR);
    this.bounds.updatePoint(bL);
    this.bounds.updatePoint(bR);
  }

  draw(offset: Point, surface: AbstractSurface): void {
    // Пока еще нет специальных функций поверхности для вывода полосатого треугольника
    const { a, b, aWidth, bWidth, color, lineWidth } = this;
    const { segs, style } = makeHashTrapezoidPath(
      a,
      aWidth,
      b,
      bWidth,
      lineWidth,
      color
    );
    if (segs.length > 0) {
      surface.drawPath(this.org.plus(offset), segs, style);
    }
  }
}

interface TrapezoidDir {
  dir: Point; // vector from a to b
  dirLen: number; // length
  dir1: Point; // unit vector from a to b
  dL: Point; // unit vector from a to left
  dR: Point; // unit vector from a to right
}

const calcTrapezoidDir = (a: Point, b: Point): TrapezoidDir => {
  const dir = b.minus(a);
  const dirLen = dir.length();
  const dir1 = is0(dirLen) ? Point.zero : dir.times(1 / dirLen);
  const dL = dir1.transpon(true);
  const dR = dir1.transpon();
  return { dir, dirLen, dir1, dL, dR };
};

const calcTrapezoidPoints = (
  a: Point,
  aWidth: number,
  b: Point,
  bWidth: number,
  dL: Point,
  dR: Point
) => {
  const aw2 = aWidth / 2;
  const bw2 = bWidth / 2;
  return {
    aL: a.plus(dL.times(aw2)),
    aR: a.plus(dR.times(aw2)),
    bL: b.plus(dL.times(bw2)),
    bR: b.plus(dR.times(bw2)),
  };
};

export const makeHashTrapezoidPath = (
  src: Point,
  srcWidth: number,
  dst: Point,
  dstWidth: number,
  lineWidth: number,
  color: string
) => {
  // Алгоритм, дающий качественное изображение на больших размерах. Использует заливку.
  // Нужно разделить ось на нечетное количество равных отрезков.
  // Ширина полоски равна расстоянию между полосками и не меньше lineWidth
  // Полоски создаются закрашенными трапециями.
  const segs: PathSeg[] = [];
  const style: PathStyle = { fill: color };

  const maxW = dstWidth / 2;
  const minW = srcWidth / 2;
  const dW = maxW - minW;
  const { dir, dirLen, dL, dR } = calcTrapezoidDir(src, dst);
  if (!is0(dirLen)) {
    let stripCount = Math.floor(dirLen / lineWidth);
    // если четное число, то уменьшить - ширина полос немного увеличится
    // eslint-disable-next-line no-bitwise
    if ((stripCount & 1) === 0) stripCount--;
    for (let i = 0; i < stripCount; i += 2) {
      const t1 = i / stripCount;
      const t2 = (i + 1) / stripCount;
      const p0 = src.plus(dir.times(t1));
      const p1 = src.plus(dir.times(t2));
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
