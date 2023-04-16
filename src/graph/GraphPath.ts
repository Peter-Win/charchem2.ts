import { EdgeEx, VertexEx } from "./ChemGraph";

export interface GraphPath<TV extends object = {}, TE extends object = {}> {
  vertices: VertexEx<TV>[];
  edges: EdgeEx<TE>[];
}
