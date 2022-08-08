import { FigFrame } from "../../drawSys/figures/FigFrame";
import { ChemBond } from "../../core/ChemBond";
import { drawBondAB } from "./drawBondAB";
import { Point } from "../../math/Point";
import { clipLineByNode } from "./clipLineByNode";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { getNodeInfo, NodeInfo } from "../NodeInfo";
import { isBondVisible } from "./isBondVisible";

interface ParamsDrawBond {
  bond: ChemBond;
  frame: FigFrame;
  props: ChemImgProps;
  nodesInfo: NodeInfo[];
}

export const drawBond = ({ bond, props, frame, nodesInfo }: ParamsDrawBond) => {
  if (!isBondVisible(bond)) return;
  const { nodeMargin } = props;
  if (bond.nodes.length !== 2) {
    // TODO: poly bond
    return;
  }
  // bond between 2 nodes
  const [node0, node1] = bond.nodes;
  if (!node0 || !node1) return;
  const { res: res0 } = getNodeInfo(node0, nodesInfo);
  const { res: res1 } = getNodeInfo(node1, nodesInfo);
  let bondA: Point | undefined = res0.nodeFrame.org.plus(res0.center);
  const { middlePoints } = bond;
  if (middlePoints) {
    // TODO: curve bond
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
  });
  // drawBondArrow(bond, 0, p0, p1);
  // drawBondArrow(bond, 1, p0, p1);
};
