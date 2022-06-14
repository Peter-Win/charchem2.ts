import { Point } from "../../math/Point";
import { PathSeg, PathVisitor } from "../path";

export const tracePath = (segments: PathSeg[], visitor: PathVisitor) => {
  let p0 = new Point();
  let prev = p0.clone();
  let cpPrev = p0.clone();
  const getPoint = (rel: boolean, p: Point): Point => (rel ? prev.plus(p) : p);
  const update = (p: Point, cp?: Point) => {
    prev = p;
    cpPrev = cp ?? p;
  };
  const calcCP = () => prev.times(2).minus(cpPrev);

  segments.forEach((seg, i) => {
    const { cmd } = seg;
    if (cmd === "Z") {
      (visitor.onZ ?? visitor.onL)(p0);
      update(p0);
    } else if (cmd === "M") {
      const curPoint = getPoint(seg.rel, seg.pt);
      visitor.onM(curPoint);
      if (i === 0) p0 = curPoint;
      update(curPoint);
    } else if (cmd === "L") {
      const curPoint = getPoint(seg.rel, seg.pt);
      visitor.onL(curPoint);
      update(curPoint);
    } else if (cmd === "H") {
      const curPoint = new Point(seg.rel ? prev.x + seg.x : seg.x, prev.y);
      (visitor.onH ?? visitor.onL)(curPoint);
      update(curPoint);
    } else if (cmd === "V") {
      const curPoint = new Point(prev.x, seg.rel ? prev.y + seg.y : seg.y);
      (visitor.onV ?? visitor.onL)(curPoint);
      update(curPoint);
    } else if (cmd === "C") {
      const cp1 = getPoint(seg.rel, seg.cp1);
      const cp2 = getPoint(seg.rel, seg.cp2);
      const dstPoint = getPoint(seg.rel, seg.pt);
      visitor.onC(cp1, cp2, dstPoint);
      update(dstPoint, cp2);
    } else if (cmd === "S") {
      const cp1 = calcCP();
      const cp2 = getPoint(seg.rel, seg.cp2);
      const dstPoint = getPoint(seg.rel, seg.pt);
      visitor.onC(cp1, cp2, dstPoint);
      update(dstPoint, cp2);
    } else if (cmd === "Q") {
      const cp = getPoint(seg.rel, seg.cp);
      const pt = getPoint(seg.rel, seg.pt);
      visitor.onQ(cp, pt);
      update(pt, cp);
    } else if (cmd === "T") {
      const cp = calcCP();
      const pt = getPoint(seg.rel, seg.pt);
      visitor.onQ(cp, pt);
      update(pt, cp);
    } else if (cmd === "A") {
      const pt = getPoint(seg.rel, seg.pt);
      visitor.onA(seg.r, seg.xRot, seg.largeArc, seg.sweep, pt);
      update(pt);
    }
  });
};
