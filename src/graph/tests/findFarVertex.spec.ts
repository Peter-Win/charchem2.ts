import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { removeHydrogen } from "../removeHydrogens";
import { makeChemGraph } from "../makeChemGraph";
import { traceGraph, WithStep } from "../traceGraph";
import { findFarVertex } from "../findFarVertex";

describe("findFarVertex", () => {
  it("several cases", () => {
    //     OH    Cl8          0     4
    //     |     |            |     |
    // 6 / 1\\2/ 7\\ 9    2 / 1\\2/ 3\\ 4
    //  ||    |     |      ||    |     |
    // 5 \  //3\11// 10   3 \  //3\ 4// 5
    //     4     |            4     |
    //           F12                5
    const expr = compile("OH|\\|`//`\\`||/\\/<`|Cl>\\\\|`//<|F>`\\");
    expect(expr.getMessage()).toBe("");
    const draftH = makeGraphFromAgent(expr.getAgents()[0]!);
    const draft = removeHydrogen(draftH);
    const graph = makeChemGraph<WithStep>(draft, { step: 0 }, {});
    traceGraph(graph);

    const v1 = findFarVertex(graph.vertices);
    expect(v1).toBeDefined();
    expect(v1?.index).toBe(10);
    v1!.step = -1;

    const v2 = findFarVertex(graph.vertices);
    expect(v2).toBeDefined();
    expect(v2?.index).toBe(12);
    v2!.step = -1;

    const v3 = findFarVertex(graph.vertices);
    expect(v3?.index).toBe(11);
    v3!.step = -1;

    const v4 = findFarVertex(graph.vertices);
    expect(v4?.index).toBe(9);
  });
});
