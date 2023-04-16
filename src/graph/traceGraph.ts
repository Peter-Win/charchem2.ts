import { ChemGraph, Edge, VertexEx } from "./ChemGraph";
import { Int } from "../types";

export interface WithStep {
  step: number;
}

export const traceGraph = (graph: ChemGraph<WithStep>): void => {
  /* eslint no-param-reassign: "off" */
  const { vertices, edges } = graph;
  if (vertices.length < 1) return;
  const NA = vertices.length + 1;
  vertices.forEach((vertex) => {
    vertex.step = NA;
  });
  vertices[0]!.step = 0;
  const queue: Int[] = [0];
  while (queue.length > 0) {
    const vIndex: Int = queue.shift()!;
    const vertex: VertexEx<WithStep> = vertices[vIndex]!;
    vertex.edges.forEach((eIndex) => {
      const edge: Edge = edges[eIndex]!;
      const vIndex2 = edge.v0 === vIndex ? edge.v1 : edge.v0;
      const vertex2: VertexEx<WithStep> = vertices[vIndex2]!;
      if (vertex2.step === NA) {
        vertex2.step = vertex.step + 1;
        queue.push(vIndex2);
      }
    });
  }
};
