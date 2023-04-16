import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { DraftGraph } from "../DraftGraph";
import { makeTextFormula } from "../../inspectors/makeTextFormula";

describe("makeGraphFromAgent", () => {
  it("simple line", () => {
    const expr = compile("/\\OH");
    expect(expr.getMessage()).toBe("");
    const g: DraftGraph = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(g.getElemList().toString()).toBe("C2H6O");
    //     H2  H5
    //     |   |
    // H---C0--C4--O7--H8
    // 1   |   |
    //     H3  H6
    expect(g.toString()).toBe(
      "v0: C*4; v1: H*1; v2: H*1; v3: H*1; v4: C*4; v5: H*1; v6: H*1; v7: O*2; v8: H*1; " +
        "e0: 0-1; e1: 0-2; e2: 0-3; e3: 4-5; e4: 4-6; e5: 7-8; e6: 0-4; e7: 4-7"
    );
  });
  it("double bond", () => {
    const expr = compile("H2C=O");
    expect(expr.getMessage()).toBe("");
    const g: DraftGraph = makeGraphFromAgent(expr.getAgents()[0]!);
    const eList = g.getElemList();
    eList.sortByHill();
    expect(eList.toString()).toBe("CH2O");
    // H1 0
    //   C == O
    // H2     3
    expect(g.toString()).toBe(
      "v0: H*1; v1: H*1; v2: C*4; v3: O*2; e0: 0-2; e1: 1-2; e2: 2-3*2"
    );
  });
  it("calc real valence", () => {
    const expr = compile("C=O");
    expect(expr.getMessage()).toBe("");
    const g: DraftGraph = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(makeTextFormula(g.vertices[0]!.content)).toBe("C");
    expect(g.vertices[0]!.valence).toBe(2);
  });
});
