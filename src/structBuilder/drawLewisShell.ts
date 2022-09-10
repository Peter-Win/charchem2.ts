import { ifDef } from "../utils/ifDef";
import { LewisDot } from "../core/ChemNodeItem";
import { Point, pointFromDeg } from "../math/Point";
import { Rect } from "../math/Rect";
import { ChemImgProps } from "../drawSys/ChemImgProps";

export interface LewisDotExt {
  c: Point;
  p: Point;
  color?: string;
}

const div = 3.5;

const calcPos: ((rc: Rect) => Point)[] = [
  (rc) => new Point(rc.right, rc.bottom - rc.height / div), // 0: right bottom
  (rc) => new Point(rc.right - rc.width / div, rc.bottom), // 1: bottom right
  (rc) => new Point(rc.left + rc.width / div, rc.bottom), // 2: bottom left
  (rc) => new Point(rc.left, rc.bottom - rc.height / div), // 3: left bottom
  (rc) => new Point(rc.left, rc.top + rc.height / div), // 4: left top
  (rc) => new Point(rc.left + rc.width / div, rc.top), // 5: top left
  (rc) => new Point(rc.right - rc.width / div, rc.top), // 6: top right
  (rc) => new Point(rc.right, rc.top + rc.height / div), // 7: right top
];

export const drawLewisShell = (
  rc: Rect,
  dots: LewisDot[],
  props: ChemImgProps,
  onDot: (dot: LewisDotExt) => void
) => {
  const c = rc.center;
  const d = rc.width + rc.height;
  dots.forEach(({ angle, pos, color, margin }) => {
    const rcCur = rc.clone();
    if (margin) rcCur.grow(margin * props.line);
    ifDef(angle, (it) => {
      const pExt = pointFromDeg(it).times(d).plus(c);
      const { b: p } = rcCur.clip(c, pExt);
      onDot({ c, p, color });
    });
    ifDef(pos, (it) => {
      const fn = calcPos[it];
      if (fn) onDot({ c, p: fn(rcCur), color });
    });
  });
};
