import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { makeChemGraph } from "../makeChemGraph";
import { Edge, VertexEx } from "../ChemGraph";
import { makeTextFormula } from "../../inspectors/makeTextFormula";

describe("makeChemGraph", () => {
  it("Simple chain", () => {
    const expr = compile("H-C%N");
    expect(expr.getMessage()).toBe("");
    const draftGraph = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(draftGraph.toString()).toBe(
      "v0: H*1; v1: C*4; v2: N*3; e0: 0-1; e1: 1-2*3"
    );
    type W = { w: number };
    const g = makeChemGraph(draftGraph, { w: 0 }, {});

    expect(g.vertices.length).toBe(3);
    const [v0, v1, v2] = g.vertices as [VertexEx<W>, VertexEx<W>, VertexEx<W>];
    expect(v0).toBeDefined();
    expect(v0.w).toBe(0);
    expect(v0.index).toBe(0);
    expect(makeTextFormula(v0.content)).toBe("H");
    expect(v0.valence).toBe(1);
    expect(v0.edges).toEqual([0]);

    expect(v1.index).toBe(1);
    expect(makeTextFormula(v1.content)).toBe("C");
    expect(v1.valence).toBe(4);
    expect(v1.edges).toEqual([0, 1]);

    expect(v2.index).toBe(2);
    expect(makeTextFormula(v2.content)).toBe("N");
    expect(v2.valence).toBe(3);
    expect(v2.edges).toEqual([1]);

    expect(g.edges.length).toBe(2);
    const [e0, e1] = g.edges as [Edge, Edge];
    expect(e0.index).toBe(0);
    expect(e0.v0).toBe(0);
    expect(e0.v1).toBe(1);
    expect(e0.mul).toBe(1);

    expect(e1.index).toBe(1);
    expect(e1.v0).toBe(1);
    expect(e1.v1).toBe(2);
    expect(e1.mul).toBe(3);
  });
  it("charge", () => {
    const expr = compile("H-O^-");
    expect(expr.getMessage()).toBe("");
    const draft = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(draft.vertices.length).toBe(2);
    expect(draft.vertices[1]!.charge).toBe(-1);
    const g = makeChemGraph(draft, { w: 0 }, {});
    expect(g.vertices.length).toBe(2);
    expect(g.vertices[1]!.charge).toBe(-1);
  });
});
