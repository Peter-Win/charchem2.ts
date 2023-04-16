import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { removeHydrogen } from "../removeHydrogens";
import { traceGraph, WithStep } from "../traceGraph";
import { makeChemGraph } from "../makeChemGraph";

describe("traceGraph", () => {
  it("trace with cycles", () => {
    //    0     8
    //    OH    Cl        0     4
    //    |     |         |     |
    // 6/ 1\\2/ 7\\9   2/ 1\\2/ 3\\4
    // ||    |    |    ||    |    |
    // 5\ 4//3\11//10  3\ 4//3\ 4//5
    //          |               |
    //          F 12            5
    const expr = compile("OH|\\|`//`\\`||/\\/<`|Cl>\\\\|`//<|F>`\\");
    expect(expr.getMessage()).toBe("");
    const draftGraphH = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(draftGraphH.getElemList().sortByHill().toString()).toBe("C10H6ClFO");
    const draftGraph = removeHydrogen(draftGraphH);
    expect(draftGraph.getElemList().sortByHill().toString()).toBe("C10ClFO");
    expect(draftGraph.vertices.length).toBe(13);
    const g = makeChemGraph<WithStep>(draftGraph, { step: 0 }, {});
    expect(g.vertices.map(({ step }) => step)).toEqual(new Array(13).fill(0));
    traceGraph(g);
    expect(g.vertices.map(({ step }) => step)).toEqual([
      0, 1, 2, 3, 4, 3, 2, 3, 4, 4, 5, 4, 5,
    ]);
  });
});
