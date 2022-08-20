import { Point } from "../../math/Point";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { ResultBuildNode } from "../buildNode";
import { clipLine } from "./clipLine";
import { PathSeg } from "../../drawSys/path";
import { FigPath } from "../../drawSys/figures/FigPath";
import { getBondColor } from "./getBondColor";
import { ChemBond } from "../../core/ChemBond";
import { drawBondArrow } from "./drawBondArrow";
import { isNodeHidden } from "../../core/isNodeHidden";

interface ParamsBezierBond {
  bond: ChemBond;
  frame: FigFrame;
  props: ChemImgProps;
  middlePoints: Point[];
  res0: ResultBuildNode;
  res1: ResultBuildNode;
}

export const drawBezierBond = ({
  bond,
  frame,
  props,
  middlePoints,
  res0,
  res1,
}: ParamsBezierBond): void => {
  const L = Math.min(middlePoints.length - 1, 2);
  if (L <= 0) return;
  const { line, lineWidth, nodeMargin } = props;
  // Подключение первого сегмента
  const rect0 = res0.rcNodeCore.clone();
  rect0.move(res0.nodeFrame.org);
  if (bond.nodes[0] && !isNodeHidden(bond.nodes[0])) rect0.grow(nodeMargin);
  const c0 = res0.center.plus(res0.nodeFrame.org);
  const rect1 = res1.rcNodeCore.clone();
  rect1.move(res1.nodeFrame.org);
  if (bond.nodes[1] && !isNodeHidden(bond.nodes[1])) rect1.grow(nodeMargin);
  const c1 = res1.center.plus(res1.nodeFrame.org);
  let prev = c0;
  const wPoints = middlePoints.slice(0, L).map((vpt) => {
    const wpt = vpt.times(line).plus(prev);
    prev = wpt;
    return wpt;
  });
  const p0 = clipLine(rect0, c0, wPoints[0]!);
  if (!p0) return;
  const p1 = clipLine(rect1, c1, wPoints[L - 1]!);
  if (!p1) return;

  const segs: PathSeg[] = [
    { cmd: "M", pt: p0 },
    L === 1
      ? { cmd: "Q", cp: wPoints[0]!, pt: p1 }
      : { cmd: "C", cp1: wPoints[0]!, cp2: wPoints[1]!, pt: p1 },
  ];
  const color = getBondColor(bond, props);
  const fig = new FigPath(segs, { stroke: color, strokeWidth: lineWidth });
  fig.update();
  frame.addFigure(fig, true);
  if (bond.arr0) {
    drawBondArrow(frame, props, wPoints[0]!, p0, color);
  }
  if (bond.arr1) {
    drawBondArrow(frame, props, wPoints[L - 1]!, p1, color);
  }
};
