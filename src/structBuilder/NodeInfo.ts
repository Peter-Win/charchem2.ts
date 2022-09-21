import { Figure } from "../drawSys/figures/Figure";
import { ChemNode } from "../core/ChemNode";
import { Point } from "../math/Point";
import { ResultBuildNode } from "./buildNode";

export interface NodeInfo {
  node: ChemNode;
  res: ResultBuildNode;
  left?: Figure;
  right?: Figure;
}

/**
 * Position of node center relative to owner frame
 */
export const getNodeCenterPos = (nodeInfo: NodeInfo): Point =>
  nodeInfo.res.nodeFrame.org.plus(nodeInfo.res.center);

export const getNodeInfo = (node: ChemNode, nodesInfo: NodeInfo[]): NodeInfo =>
  nodesInfo[node.index]!;
// Предполагается, что все узлы уже включены в nodesInfo. Поэтому результат не может быть undefined
