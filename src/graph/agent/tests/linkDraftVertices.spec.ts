import { compile } from "../../../compiler/compile";
import { Int } from "../../../types";
import { DraftGraph, DraftVertex } from "../../DraftGraph";
import { linkDraftVertices } from "../linkDraftVertices";
import { ChemBond } from "../../../core/ChemBond";
import { makeGraphFromAgent } from "../../makeGraphFromAgent";
import { removeHydrogen } from "../../removeHydrogens";
import { makeChemGraph } from "../../makeChemGraph";

describe("linkDraftVertices", () => {
  it("linear", () => {
    const expr = compile("H-C%N");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds.length).toBe(2);
    const [b1, b3] = agent.bonds as [ChemBond, ChemBond];
    const aGraph = new DraftGraph();
    const nodesDict: Record<Int, DraftGraph> = {};
    expect(agent.nodes.length).toBe(3);
    [1, 4, 3].forEach((valency, i) => {
      const node = agent.nodes[i]!;
      expect(node).toBeDefined();
      const vertex: DraftVertex = {
        content: node.items[0]!.obj,
        valence: valency,
        reserved: valency,
      };
      const gr = new DraftGraph();
      gr.vertices.push(vertex);
      nodesDict[node.index] = gr;
      aGraph.addGraph(gr);
    });

    linkDraftVertices(aGraph, b1, nodesDict);
    expect(aGraph.edges.length).toBe(1);
    const edge0 = aGraph.edges[0]!;
    expect(edge0).toBeDefined();
    expect(edge0.mul).toBe(1);
    expect(edge0.v0.valence).toBe(1);
    expect(edge0.v0.reserved).toBe(0);
    expect(edge0.v1.valence).toBe(4);
    expect(edge0.v1.reserved).toBe(3);

    linkDraftVertices(aGraph, b3, nodesDict);
    expect(aGraph.edges.length).toBe(2);
    const edge1 = aGraph.edges[1]!;
    expect(edge1).toBeDefined();
    expect(edge1.mul).toBe(3);
    expect(edge1.v0.valence).toBe(4);
    expect(edge1.v0.reserved).toBe(0);
    expect(edge1.v1.valence).toBe(3);
    expect(edge1.v1.reserved).toBe(0);
  });

  it("Chiral", () => {
    //      3       7
    //     2E      6V
    //      2       6       9
    //   1/   \3  /5  \7  V8
    //  1       4       8
    //  П0     4A      9|
    //  O       5       10
    const expr = compile("O`||/<`|dOH>\\<|wOH>/<`|wOH>\\</wOH>|CH3");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds[2]!.w0).toBe(0);
    expect(agent.bonds[2]!.w1).toBe(-1);
    expect(agent.bonds[4]!.w0).toBe(0);
    expect(agent.bonds[4]!.w1).toBe(1);
    const draft = removeHydrogen(makeGraphFromAgent(agent));
    expect(draft.edges.map(({ chiralDir }) => chiralDir)).toEqual([
      0, 0, -1, 0, 1, 0, 1, 0, 1, 0,
    ]);
    const g = makeChemGraph(draft, {}, {});
    expect(g.edges.map(({ chiralDir }) => chiralDir)).toEqual([
      0, 0, -1, 0, 1, 0, 1, 0, 1, 0,
    ]);
  });
});
