import { ChemGraph, Edge, otherVertex, VertexEx } from "./ChemGraph";
import { WithStep } from "./traceGraph";
import { GraphCycle } from "./GraphCycle";
import { Int } from "../types";

// TODO: Выяснилось, что есть неоднозначные случаи с циклами
// Маленький цикл вложен в большой: $slope(45){0}`/{1}`/{2}\{3}</{2}`\>\{4}/{3}/{2}`\{1}`\
// Параллельные циклы: $L(1.6){0}`/{1}|{2}\{3}/{2}`|{1}`\_(x-.5,y1){1}_(y1.2){2}_#4

export const findCycles = (graph: ChemGraph<WithStep>): GraphCycle[] => {
  const result: GraphCycle[] = [];
  const { vertices, edges } = graph;
  const addCycle = (
    vertex1: VertexEx<WithStep>,
    vertex2: VertexEx<WithStep>
  ) => {
    const backQueue: VertexEx<WithStep>[] = [vertex2];
    if (vertex1.step === vertex2.step) backQueue.push(vertex1);
    while (backQueue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vertex = backQueue.shift();
    }
    throw new Error(
      `v1: ${vertex1.index}, ${vertex1.step}; v2: ${vertex2.index}, ${vertex2.step}`
    );
  };
  const NA = vertices.length + 1;
  if (NA !== 1) {
    vertices.forEach((vertex) => {
      // eslint-disable-next-line no-param-reassign
      vertex.step = NA;
    });

    vertices[0]!.step = 0;
    type QueueItem = { vIndex: Int; prevIndex?: Int };
    const queue: QueueItem[] = [{ vIndex: 0 }];
    while (queue.length > 0) {
      const { vIndex, prevIndex } = queue.shift()!;
      const vertex: VertexEx<WithStep> = vertices[vIndex]!;
      vertex.edges.forEach((eIndex) => {
        const edge: Edge = edges[eIndex]!;
        const vIndex2 = otherVertex(edge, vIndex);
        const vertex2: VertexEx<WithStep> = vertices[vIndex2]!;
        if (vertex2.step === NA) {
          vertex2.step = vertex.step + 1;
          queue.push({ vIndex: vIndex2, prevIndex: vIndex });
        } else if (vIndex2 !== prevIndex) {
          addCycle(vertex, vertex2);
        }
      });
    }
  }
  return result;
};
