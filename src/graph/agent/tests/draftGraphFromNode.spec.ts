import { compile } from "../../../compiler/compile";
import { draftGraphFromNode } from "../draftGraphFromNode";
import { ChemNode } from "../../../core/ChemNode";

const compileNode = (formula: string): ChemNode =>
  compile(formula).getAgents()[0]!.nodes[0]!;

describe("draftGraphFromNode", () => {
  it("simple", () => {
    const g1 = draftGraphFromNode(compileNode("CH3"));
    expect(g1.getElemList().toString()).toBe("CH3");
    expect(g1.reserved).toBe(1);

    const g2 = draftGraphFromNode(compileNode("OH"));
    expect(g2.getElemList().toString()).toBe("OH");
    expect(g2.reserved).toBe(1);

    const g3 = draftGraphFromNode(compileNode("O"));
    expect(g3.getElemList().toString()).toBe("O");
    expect(g3.reserved).toBe(2);
  });
  it("ions", () => {
    const g1 = draftGraphFromNode(compileNode("H^+"));
    expect(g1.toString()).toBe("v0: H*1*1^1");
    const g2 = draftGraphFromNode(compileNode("OH^-"));
    expect(g2.toString()).toBe("v0: O*2*1^-1; v1: H*1; e0: 0-1");
    const g3 = draftGraphFromNode(compileNode("NH4^+"));
    expect(g3.toString()).toBe(
      "v0: N*3*-1^1; v1: H*1; v2: H*1; v3: H*1; v4: H*1; e0: 0-1; e1: 0-2; e2: 0-3; e3: 0-4"
    );
  });
});
