import { addAll } from "../utils/addAll";
import { Int } from "../types";
import { ElemList } from "../core/ElemList";
import { ChemAtom } from "../core/ChemAtom";
import { ChemCustom } from "../core/ChemCustom";
import { makeTextFormula } from "../inspectors/makeTextFormula";
import { CommonVertex } from "./CommonVertex";
import { CommonEdge } from "./CommonEdge";

export interface DraftVertex extends CommonVertex {
  reserved?: Int; // Количество связей, зарезервированных для соединения с другими графами
}

export interface DraftEdge extends CommonEdge {
  v0: DraftVertex;
  v1: DraftVertex;
}

export class DraftGraph {
  vertices: DraftVertex[] = [];

  edges: DraftEdge[] = [];

  addGraph(another: DraftGraph) {
    addAll(this.vertices, another.vertices);
    addAll(this.edges, another.edges);
  }

  getElemList(): ElemList {
    const list = new ElemList();
    this.vertices.forEach(({ content }) => {
      if (content instanceof ChemAtom) {
        list.addAtom(content);
      } else if (content instanceof ChemCustom) {
        list.addCustom(content.text);
      }
    });
    return list;
  }

  get reserved(): Int {
    return this.vertices.reduce((sum, { reserved = 0 }) => sum + reserved, 0);
  }

  getConnections(): DraftVertex[] {
    return this.vertices.filter(({ reserved }) => !!reserved);
  }

  toString() {
    const vIndex = (target: DraftVertex): number =>
      this.vertices.indexOf(target);
    return [
      ...this.vertices.map(
        (v, i) =>
          `v${i}: ${makeTextFormula(v.content)}*${v.valence}${
            v.reserved ? `*${v.reserved}` : ""
          }${v.charge ? `^${v.charge}` : ""}`
      ),
      ...this.edges.map(
        (e, i) =>
          `e${i}: ${vIndex(e.v0)}-${vIndex(e.v1)}${
            e.mul !== 1 ? `*${e.mul}` : ""
          }`
      ),
    ].join("; ");
  }
}
