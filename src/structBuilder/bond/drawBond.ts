import { FigFrame } from "../../drawSys/figures/FigFrame";
import { ChemBond } from "../../core/ChemBond";
import { drawBondAB } from "./drawBondAB";
import { Point } from "../../math/Point";
import { clipLineByNode } from "./clipLineByNode";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { getNodeInfo, NodeInfo } from "../NodeInfo";
import { drawBondPoly } from "./drawBondPoly";
import { StructAnalyzer } from "../../core/StructAnalyzer";
import { drawBezierBond } from "./drawBezierBond";

interface ParamsDrawBond {
  bond: ChemBond;
  frame: FigFrame;
  props: ChemImgProps;
  nodesInfo: NodeInfo[];
  stA: StructAnalyzer;
}

export const drawBond = ({
  bond,
  props,
  frame,
  nodesInfo,
  stA,
}: ParamsDrawBond) => {
  if (!bond.isVisible()) return;
  const { nodeMargin } = props;
  if (bond.nodes.length !== 2) {
    drawBondPoly(bond, frame, props, nodesInfo);
    return;
  }
  // bond between 2 nodes
  const [node0, node1] = bond.nodes;
  if (!node0 || !node1) return;
  const { res: res0 } = getNodeInfo(node0, nodesInfo);
  const { res: res1 } = getNodeInfo(node1, nodesInfo);
  let bondA: Point | undefined = res0.nodeFrame.org.plus(res0.center);
  const { middlePoints } = bond;
  if (middlePoints && middlePoints.length > 0) {
    drawBezierBond({ bond, frame, props, middlePoints, res0, res1 });
    return;
  }
  let bondB: Point | undefined = res1.nodeFrame.org.plus(res1.center);
  bondA = clipLineByNode(node0, res0, bondA, bondB, nodeMargin);
  if (!bondA) return;
  bondB = clipLineByNode(node1, res1, bondB, bondA, nodeMargin);
  if (!bondB) return;
  drawBondAB({
    bond,
    bondA,
    bondB,
    frame,
    imgProps: props,
    stA,
  });
};
