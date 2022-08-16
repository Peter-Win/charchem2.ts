import { Point } from "../../math/Point";
import { ChemBond } from "../../core/ChemBond";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigEllipse } from "../../drawSys/figures/FigEllipse";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { getNodeCenterPos, getNodeInfo, NodeInfo } from "../NodeInfo";
import { getBondColor } from "./getBondColor";
import { PathStyle } from "../../drawSys/AbstractSurface";
import { FigBSpline } from "../../drawSys/figures/FigBSpline";

const calcCenter = (wPoints: Point[]): Point =>
  wPoints
    .reduce((sum, wpt) => sum.iadd(wpt), new Point())
    .scale(1 / wPoints.length);

export const drawBondPoly = (
  bond: ChemBond,
  frame: FigFrame,
  imgProps: ChemImgProps,
  nodesInfo: NodeInfo[]
): void => {
  const color = getBondColor(bond, imgProps);
  const { lineWidth, dash } = imgProps;
  const { nodes } = bond;
  const wPoints = nodes
    .filter((n) => !!n)
    .map((n) => getNodeCenterPos(getNodeInfo(n!, nodesInfo)));
  if (wPoints.length < 2) return;
  const center = calcCenter(wPoints);
  const style: PathStyle = { stroke: color, strokeWidth: lineWidth };
  if (bond.ext === "o") {
    const p0 = wPoints[0]!;
    const p1 = wPoints[1]!;
    const v = p0.plus(p1).times(0.5);
    const r = center.minus(v).length() * 0.7;
    const fig = new FigEllipse(center, new Point(r, r), style);
    frame.addFigure(fig);
  } else if (bond.ext === "s") {
    //= ==== Связь, объединяющая несколько узлов при помощи Би-сплайна
    let i = 0;
    let n = wPoints.length;
    if (!bond.isCycle) {
      // не циклический вариант
      // Линия выходит из концов и проходит на некотором расстоянии от остальных точек, смещаясь к центру
      i++;
      n--;
    }
    for (; i < n; i++) {
      const p = wPoints[i]!;
      const d = center.minus(p);
      p.iadd(d.times(0.2));
    }
    // const segs: PathSeg[] = wPoints.map((pt, i) => ({cmd: i>0 ? "L":"M", pt}))
    // if (bond.isCycle) segs.push({cmd:"Z"});
    // const fig = new FigPath(segs, style);
    const bPoints = FigBSpline.extendsPoints(wPoints, bond.isCycle);
    if (bPoints) {
      const fig = new FigBSpline(bPoints, style, dash, bond.style === ":");
      frame.addFigure(fig);
    }
  }
};
