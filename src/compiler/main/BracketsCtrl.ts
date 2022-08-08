import { ChemBracketBegin, ChemBracketEnd } from "../../core/ChemBracket";
import { ChemNode } from "../../core/ChemNode";

export class BracketsCtrl {
  private queue: (ChemBracketBegin | ChemBracketEnd)[] = [];

  clear() {
    this.queue.length = 0;
  }

  onNode(node: ChemNode) {
    this.queue.forEach((obj) => {
      obj.nodes[1] = node;
    });
    this.clear();
  }

  onBracket(obj: ChemBracketBegin | ChemBracketEnd) {
    this.queue.push(obj);
  }
}
