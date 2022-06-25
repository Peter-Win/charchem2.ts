import { ChemNode } from "../../core/ChemNode";

export class NodesBranch {
  private readonly nbStack: Array<ChemNode[]> = []; // mutableListOf<MutableList<ChemNode>>()

  nodes: ChemNode[] = [];

  onBranchBegin() {
    const copy = [...this.nodes];
    this.nbStack.unshift(copy);
  }

  onBranchEnd() {
    const svNodes = this.nbStack.shift();
    if (svNodes) this.nodes = svNodes;
  }

  onSubChain() {
    this.nodes.length = 0;
  }

  onNode(node: ChemNode) {
    this.nodes.push(node);
  }
}
