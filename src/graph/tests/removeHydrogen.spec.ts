import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { removeHydrogen } from "../removeHydrogens";
import { DraftVertex } from "../DraftGraph";
import { ChemAtom } from "../../core/ChemAtom";

describe("removeHydrogen", () => {
  it("Ethanol", () => {
    const expr = compile("/\\OH");
    expect(expr.getMessage()).toBe("");
    //     H1 H5
    //  H2-C0-C4-O7-H8
    //     H3 H6
    const g1 = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(g1.toString()).toBe(
      "v0: C*4; v1: H*1; v2: H*1; v3: H*1; v4: C*4; v5: H*1; v6: H*1; v7: O*2; v8: H*1; " +
        "e0: 0-1; e1: 0-2; e2: 0-3; e3: 4-5; e4: 4-6; e5: 7-8; e6: 0-4; e7: 4-7"
    );
    expect(g1.vertices[0]!.hydrogen).toBeUndefined();
    // 0 1 2
    // C-C-O
    const g2 = removeHydrogen(g1);
    expect(g2.toString()).toBe("v0: C*4; v1: C*4; v2: O*2; e0: 0-1; e1: 1-2");
    expect(g2.vertices.map(({ hydrogen }) => hydrogen)).toEqual([3, 2, 1]);
  });

  it("Hydrogen with charge", () => {
    // H+      H
    // 0 \ 1 / 2
    //     O-
    const expr = compile("H^+\\0O`^-/H");
    expect(expr.getMessage()).toBe("");
    const g1 = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(g1.toString()).toBe(
      "v0: H*1^1; v1: O*2^-1; v2: H*1; e0: 0-1*0; e1: 1-2"
    );
    const g2 = removeHydrogen(g1);
    expect(g2.toString()).toBe("v0: H*1^1; v1: O*2^-1; e0: 0-1*0");
  });
  it("use canRemove", () => {
    const canRemoveSm = (vh: DraftVertex, vNear?: DraftVertex): boolean => {
      if (vNear) {
        const { content, charge, reserved } = vNear;
        if (content instanceof ChemAtom && !charge && !reserved) {
          return true;
        }
      }
      return false;
    };
    const expr1 = compile("CH3-OH");
    const agent1 = expr1.getAgents()[0]!;
    const grH1 = makeGraphFromAgent(agent1);
    const gr1 = removeHydrogen(grH1, canRemoveSm);
    expect(gr1.toString()).toBe("v0: C*4; v1: O*2; e0: 0-1");

    // Ammonium
    const expr2 = compile("NH4^+");
    const agent2 = expr2.getAgents()[0]!;
    const grH2 = makeGraphFromAgent(agent2);
    expect(grH2.toString()).toBe(
      "v0: N*3*-1^1; v1: H*1; v2: H*1; v3: H*1; v4: H*1; e0: 0-1; e1: 0-2; e2: 0-3; e3: 0-4"
    );
    const gr2 = removeHydrogen(grH2, canRemoveSm);
    expect(gr2.toString()).toBe(
      "v0: N*3*-1^1; v1: H*1; v2: H*1; v3: H*1; v4: H*1; e0: 0-1; e1: 0-2; e2: 0-3; e3: 0-4"
    );
  });
});
