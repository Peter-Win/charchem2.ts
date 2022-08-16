import { ChemNode } from "../core/ChemNode";
import { isEmptyNode } from "../core/isEmptyNode";

export const isNodeHidden = (node: ChemNode): boolean =>
  node.autoMode || isEmptyNode(node);
