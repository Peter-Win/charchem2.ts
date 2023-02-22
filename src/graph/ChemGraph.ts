import { Int } from "../types";
import { ChemEdge } from "./ChemEdge";
import { ChemVertex } from "./ChemVertex";

export class ChemGraph {
  vertices: ChemVertex[] = [];

  edges: ChemEdge[] = [];

  addVertex(vertexDef: Omit<ChemVertex, "index">): ChemVertex {
    const newVertex = { ...vertexDef, index: this.vertices.length };
    this.vertices.push(newVertex);
    return newVertex;
  }

  addEdge(edgeDef: Omit<ChemEdge, "index">): ChemEdge {
    const newEdge = { ...edgeDef, index: this.edges.length };
    this.edges.push(newEdge);
    return newEdge;
  }

  createEdge(vertex0: ChemVertex, vertex1: ChemVertex, mul: Int = 1): ChemEdge {
    return this.addEdge({
      v0: vertex0.index,
      v1: vertex1.index,
      mul,
    });
  }
}
