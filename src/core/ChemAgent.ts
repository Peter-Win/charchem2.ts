import { Int } from "../types";
import { ChemObj } from "./ChemObj";
import { ChemNode } from "./ChemNode";
import { ChemBond } from "./ChemBond";
import { ChemK } from "./ChemK";
import { Visitor } from "./Visitor";

export class ChemAgent extends ChemObj {
  nodes: ChemNode[] = [];

  bonds: ChemBond[] = [];

  commands: ChemObj[] = [];

  n: ChemK = new ChemK(1);

  part: Int = 0;

  addNode(node: ChemNode): ChemNode {
    this.nodes.push(node);
    this.commands.push(node);
    return node;
  }

  addBond(bond: ChemBond) {
    this.bonds.push(bond);
    this.commands.push(bond);
  }

  override walk(visitor: Visitor) {
    visitor.agentPre?.(this);
    if (visitor.isStop) return;
    for (const cmd of this.commands) {
      cmd.walk(visitor);
      if (visitor.isStop) return;
    }
    visitor.agentPost?.(this);
  }
}
