import { ChemGraph, Edge, otherVertex, Vertex, VertexEx } from "./ChemGraph";
import { WithStep } from "./traceGraph";
import { findFarVertex } from "./findFarVertex";
import { GraphPath } from "./GraphPath";

interface VertexEdge {
  vertex: VertexEx<WithStep>;
  edge: Edge;
}

export interface SpanningTreeNode {
  vertex: Vertex;
  edge?: Edge; // edge to prev node. Empty for first node in trunk
  branches: SpanningTreeNode[][];
}

export interface SpanningTree {
  vertices: Vertex[];
  closures: Edge[];
  trunk: SpanningTreeNode[];
}

type Path = GraphPath<WithStep>;

export const buildSpanningTree = (graph: ChemGraph<WithStep>): SpanningTree => {
  const used = -1;
  const { vertices } = graph;
  const nodes: SpanningTreeNode[] = vertices.map((vertex) => ({
    vertex,
    branches: [],
  }));
  const unusedEdgesNdx = new Set(graph.edges.map(({ index }) => index));
  let trunk: SpanningTreeNode[] = [];
  for (;;) {
    const farVertex = findFarVertex(vertices);
    if (!farVertex) break;
    const path = backFindPath(graph, farVertex);
    const branch: SpanningTreeNode[] = path.vertices.map(
      ({ index }) => nodes[index]!
    );
    path.vertices.forEach((v) => {
      // eslint-disable-next-line no-param-reassign
      v.step = used;
    });
    path.edges.forEach((e, i) => {
      unusedEdgesNdx.delete(e.index);
      const v: Vertex = path.vertices[i + 1]!;
      const node = nodes[v.index]!;
      node.edge = e;
    });
    const vIndex = path.vertices[0]!.index;
    if (vIndex === 0) {
      trunk = branch;
    } else {
      // найти более раннюю ветку
      const v0 = vertices[vIndex]!;
      let found: VertexEdge | null = null;
      for (const eIndex of v0.edges) {
        const edge = graph.edges[eIndex]!;
        const vi = otherVertex(edge, vIndex);
        const vertex = vertices[vi]!;
        if (vertex.step === used) {
          if (!found || vertex.index < found.vertex.index) {
            found = { edge, vertex };
          }
        }
      }
      if (found) {
        branch[0]!.edge = found.edge;
        unusedEdgesNdx.delete(found.edge.index);
        const node = nodes[found.vertex.index]!;
        node.branches.push(branch);
      } else {
        throw new Error("Cant add branch");
      }
    }
  }
  return {
    vertices,
    closures: graph.edges.filter(({ index }) => unusedEdgesNdx.has(index)),
    trunk,
  };
};

export const backFindPath = (
  graph: ChemGraph<WithStep>,
  start: VertexEx<WithStep>
): Path => {
  let curVertex = start;
  const path: Path = {
    vertices: [curVertex],
    edges: [],
  };
  for (;;) {
    const { step, index: iv0 } = curVertex;
    if (step === 0) break;
    let point: VertexEdge | null = null;
    for (const eIndex of curVertex.edges) {
      const edge = graph.edges[eIndex]!;
      const iv1 = otherVertex(edge, iv0);
      const vertex = graph.vertices[iv1]!;
      if (vertex.step === step - 1) {
        point = { vertex, edge };
        break;
      }
    }
    if (!point) break;
    path.vertices.unshift(point.vertex);
    path.edges.unshift(point.edge);
    curVertex = point.vertex;
  }
  return path;
};

//  vertex index       steps             first step        second step
//     0     8           0     4           #     4           #     4
//     |     |           |     |           |     |           |     |
// 6 / 1 \2/ 7 \ 9   2 / 1 \2/ 3 \ 4   2 / # \#/ # \ #   2 / # \#/ # \ #
//  |     |     |     |     |     |     |     |     |     |     |     |
// 5 \ 4 /3\ 11/ 10  3 \ 4 /3\ 4 / 5   3 \ 4 /3\ 4 . #   3 \ 4 .%\ % . #
//           |                 |                 |                 |
//           12                5                 5                 %
