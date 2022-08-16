import { Rect, updateRect } from "../../math/Rect";
import { Point } from "../../math/Point";
import { AbstractSurface, PathStyle } from "../AbstractSurface";
import { PathSeg, PathSegPt } from "../path";
import { Figure } from "./Figure";

export class FigBSpline extends Figure {
  // Создать фигуру B-сплайна.
  // Список точек должен иметь три фиктивные точки, которые не выдны при выводе.
  // Одна в начала, две в конце. Для их вычисления можно использовать FigBSpline.extendsPoints
  // фиктивные точки: points[0], points[n-1], points[n-2]
  constructor(
    public readonly points: Point[],
    public readonly style: PathStyle,
    public readonly segmentLength: number,
    public readonly bDashed: boolean
  ) {
    super();
  }

  update(): void {
    this.bounds =
      this.points
        .slice(1, -2)
        .reduce(
          (rect: Rect | undefined, p: Point) => updateRect(p, rect),
          undefined
        ) ?? new Rect();
  }

  draw(offset: Point, surface: AbstractSurface): void {
    const segs: PathSeg[] = [];
    const { points } = this;
    const n = points.length;
    const L = n - 3;
    if (L < 1) return;
    const bCycled = points[1]!.equals(points[L]!); // Сплайн циклический, если совпадают крайние видимые точки

    // Вычислить длину каждой видимой грани и их сумму
    let sumLen = 0;
    const edgesLen = [0]; // длины видимых кусков
    for (let i = 1; i < L; i++) {
      const len = points[i]!.dist(points[i + 1]!);
      sumLen += len;
      edgesLen[i] = len;
    }
    let nSegs = Math.floor(sumLen / this.segmentLength + 0.5); // Количество сегментов
    if (this.bDashed) {
      // Для прерывистой линии нужно скорректировать количество сегментов
      // число сегментов должно быть нечётным для разомкнутой кривой и чётной для зацикленной
      // eslint-disable-next-line no-bitwise
      if (nSegs & 1) {
        // нечётное число сегментов не годится для цикла
        if (bCycled) nSegs++;
      } else if (!bCycled) {
        // Чётное число не годится для разомкнутой кривой
        nSegs++;
      }
    }
    // скорректировать длину сегмента
    const segmentLength = sumLen / nSegs;
    // Теперь движемся одновременно по сегментам и по граням
    let i = 0;
    let len = 0;
    let curEdge = 0;
    let newEdge = 1;
    let a3 = Point.zero;
    let a2 = Point.zero;
    let a1 = Point.zero;
    let a0 = Point.zero;
    let edgeK = 0;
    for (; ; i++) {
      if (newEdge !== curEdge) {
        if (newEdge >= L) break;
        // Переход на новое ребро. Пересчёт коэффициентов
        curEdge = newEdge;
        edgeK = 1 / edgesLen[curEdge]!;

        a3 = points[curEdge]!.times(3);
        a3.isub(points[curEdge - 1]!);
        a3.iadd(points[curEdge + 1]!.times(-3));
        a3.iadd(points[curEdge + 2]!);
        a3.scale(1 / 6);

        a2 = points[curEdge]!.times(-2);
        a2.iadd(points[curEdge - 1]!)
          .iadd(points[curEdge + 1]!)
          .scale(0.5);

        a1 = points[curEdge + 1]!.minus(points[curEdge - 1]!).scale(0.5);

        a0 = points[curEdge]!.times(4);
        a0.iadd(points[curEdge - 1]!)
          .iadd(points[curEdge + 1]!)
          .scale(1 / 6);
      }
      const t = len * edgeK;
      const pt = a3.times(t).iadd(a2).scale(t).iadd(a1).scale(t).iadd(a0);
      // eslint-disable-next-line no-bitwise
      segs.push({ cmd: (this.bDashed && i & 1) || i === 0 ? "M" : "L", pt });

      len += segmentLength;
      // вохможно, переход на новое ребро
      while (len >= edgesLen[newEdge]!) {
        len -= edgesLen[newEdge]!;
        newEdge++;
      }
    }
    if (bCycled) {
      segs.push(
        !this.bDashed
          ? { cmd: "Z" }
          : { cmd: "L", pt: (segs[0] as PathSegPt).pt }
      );
    } else {
      segs.push({ cmd: "L", pt: points[newEdge]! }); // Последний сегмент
    }
    surface.drawPath(offset.plus(this.org), segs, this.style);
  }

  /**
   * Добавить фиктивные (не рисуемые) точки.
   * режиме цикла:
   *  - проверяется совпадение первой и последней точки. Если не совпадают, то добавляется.
   *  - для фиктивных точек тоже используются существующие точки
   * Для незамкнутого сплайна фиктивные точки строятся на продолжении крайних сегментов
   * @param srcPoints
   * @param bCyclic
   */
  static extendsPoints(
    srcPoints: Point[],
    bCyclic: boolean
  ): Point[] | undefined {
    const n = srcPoints.length;
    if (n < 3) return undefined;
    const first = srcPoints[0]!;
    const second = srcPoints[1]!;
    const last = srcPoints[n - 1]!;
    const preLast = srcPoints[n - 2]!;
    if (bCyclic) {
      const dstPoints = [...srcPoints];
      let newLast = last;
      if (first.equals(last)) {
        // Последовательность уже замкнута. Конечная точка отступает назад
        newLast = preLast;
      } else {
        // // Добавляем в конец точку (используемую при выводе), совпадающую с первой
        dstPoints.push(first);
      }
      // Добавить три фиктивные точки: две назад, одна вперёд
      dstPoints.push(second);
      dstPoints.push(srcPoints[2]!);
      dstPoints.unshift(newLast);
      return dstPoints;
    }
    const firstStep = second.minus(first);
    const lastStep = last.minus(preLast);
    const e = last.plus(lastStep);
    return [first.minus(firstStep), ...srcPoints, e, e.plus(lastStep)];
  }
}
