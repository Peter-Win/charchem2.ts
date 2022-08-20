import { ChemNode } from "./ChemNode";
import { isEmptyNode } from "./isEmptyNode";

export const isNodeHidden = (node: ChemNode): boolean =>
  node.autoMode || isEmptyNode(node);
