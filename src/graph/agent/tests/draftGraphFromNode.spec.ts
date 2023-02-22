import { compile } from "../../../compiler/compile";
import { draftGraphFromNode } from "../draftGraphFromNode";

describe("draftGraphFromNode", () => {
  it("most simple", () => {
    const g1 = draftGraphFromNode(compile("CH3").getAgents()[0]!.nodes[0]!);
    expect(g1.getElemList().toString()).toBe("CH3");
    expect(g1.reserved).toBe(1);

    const g2 = draftGraphFromNode(compile("OH").getAgents()[0]!.nodes[0]!);
    expect(g2.getElemList().toString()).toBe("OH");
    expect(g2.reserved).toBe(1);

    const g3 = draftGraphFromNode(compile("O").getAgents()[0]!.nodes[0]!);
    expect(g3.getElemList().toString()).toBe("O");
    expect(g3.reserved).toBe(2);
  });
});
