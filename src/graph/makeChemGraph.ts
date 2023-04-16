import { Int } from "../types";
import { DraftEdge, DraftGraph, DraftVertex } from "./DraftGraph";
import { ChemError } from "../core/ChemError";
import { ChemGraph, EdgeEx, VertexEx } from "./ChemGraph";

export const makeChemGraph = <TV extends Object = {}, TE extends Object = {}>(
  draftGraph: DraftGraph,
  extVertex: TV | ((v: DraftVertex, index: Int) => TV),
  extEdge: TE | ((e: DraftEdge, index: Int) => TE)
): ChemGraph<TV, TE> => {
  const graph = new ChemGraph<TV, TE>();
  const vMap = new Map<DraftVertex, number>();
  const vertices = draftGraph.vertices.map((draftV, index): VertexEx<TV> => {
    vMap.set(draftV, index);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reserved, ...rest } = draftV;
    return {
      index,
      ...rest,
      edges: [],
      ...(typeof extVertex === "object" ? extVertex : extVertex(draftV, index)),
    };
  });
  graph.vertices = vertices;
  graph.edges = draftGraph.edges.map((e: DraftEdge, index): EdgeEx<TE> => {
    const { v0, v1, ...rest } = e;
    const iv0 = vMap.get(v0);
    const iv1 = vMap.get(v1);
    if (iv0 === undefined || iv1 === undefined)
      throw new ChemError("Invalid vertex");
    vertices[iv0]?.edges.push(index);
    vertices[iv1]?.edges.push(index);
    return {
      index,
      v0: iv0,
      v1: iv1,
      ...rest,
      ...(typeof extEdge === "object" ? extEdge : extEdge(e, index)),
    };
  });
  return graph;
};
