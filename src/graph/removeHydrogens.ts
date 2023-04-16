import { DraftGraph, DraftVertex } from "./DraftGraph";
import { ChemAtom } from "../core/ChemAtom";

export const removeHydrogen = (
  graph: DraftGraph,
  canRemove?: (h: DraftVertex, near?: DraftVertex) => boolean
): DraftGraph => {
  const hSet = new Set<DraftVertex>();
  const checkVertex = (vh: DraftVertex, vOther: DraftVertex) => {
    const { content, charge, mass, reserved } = vh;
    if (
      content instanceof ChemAtom &&
      content.id === "H" &&
      !charge &&
      !mass &&
      !reserved &&
      (canRemove ? canRemove(vh, vOther) : true)
    ) {
      hSet.add(vh);
      // eslint-disable-next-line no-param-reassign
      vOther.hydrogen = (vOther?.hydrogen ?? 0) + 1;
    }
  };
  graph.edges.forEach((e) => {
    checkVertex(e.v0, e.v1);
    checkVertex(e.v1, e.v0);
  });
  const newGraph = new DraftGraph();
  newGraph.vertices = graph.vertices.filter((v) => !hSet.has(v));
  newGraph.edges = graph.edges.filter(
    (e) => !hSet.has(e.v0) && !hSet.has(e.v1)
  );
  return newGraph;
};
