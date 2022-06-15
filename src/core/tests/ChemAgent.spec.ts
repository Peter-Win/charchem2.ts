import { ChemAgent } from "../ChemAgent";
import { ChemNode } from "../ChemNode";
import { ChemNodeItem } from "../ChemNodeItem";
import { PeriodicTable } from "../PeriodicTable";
import { ChemK } from "../ChemK";
import { ChemBond } from "../ChemBond";
import { ChemAtom } from "../ChemAtom";

describe("ChemAgent", () => {
  it("walk", () => {
    const { dict } = PeriodicTable;
    const n1 = new ChemNode();
    n1.items.push(new ChemNodeItem(dict.C));
    n1.items.push(new ChemNodeItem(dict.H, new ChemK(3)));
    const b1 = new ChemBond();
    b1.tx = "-";
    const n2 = new ChemNode();
    n2.items.push(new ChemNodeItem(dict.O));
    n2.items.push(new ChemNodeItem(dict.H));
    const agent = new ChemAgent();
    agent.n = new ChemK(2);
    agent.addNode(n1);
    agent.addBond(b1);
    agent.addNode(n2);
    let result = "";
    agent.walk({
      agentPre(obj: ChemAgent) {
        result += obj.n;
        result += "[";
      },

      agentPost() {
        result += "]";
      },

      atom(obj: ChemAtom) {
        result += obj.id;
      },

      itemPost(obj: ChemNodeItem) {
        if (obj.n.isSpecified()) result += obj.n;
      },

      bond(obj: ChemBond) {
        result += obj.tx;
      },
    });
    expect(result).toBe("2[CH3-OH]");
  });
});
