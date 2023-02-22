import { addAll } from "../utils/addAll";
import { Int } from "../types";
import { ChemSubObj } from "../core/ChemSubObj";
import { ElemList } from "../core/ElemList";
import { ChemAtom } from "../core/ChemAtom";
import { ChemCustom } from "../core/ChemCustom";

export interface DraftVertex {
  readonly content: ChemSubObj;
  readonly valency: Int;
  reserved?: Int; // Количество связей, зарезервированных для соединения с другими графами
  charge?: Int;
  mass?: Int; // for isotopes
}

export interface DraftEdge {
  v0: DraftVertex;
  v1: DraftVertex;
  mul: Int;
}

export class DraftGraph {
  verices: DraftVertex[] = [];

  edges: DraftEdge[] = [];

  addGraph(another: DraftGraph) {
    addAll(this.verices, another.verices);
    addAll(this.edges, another.edges);
  }

  getElemList(): ElemList {
    const list = new ElemList();
    this.verices.forEach(({ content }) => {
      if (content instanceof ChemAtom) {
        list.addAtom(content);
      } else if (content instanceof ChemCustom) {
        list.addCustom(content.text);
      }
    });
    return list;
  }

  get reserved(): Int {
    return this.verices.reduce((sum, { reserved = 0 }) => sum + reserved, 0);
  }

  getConnections(): DraftVertex[] {
    return this.verices.filter(({ reserved }) => !!reserved);
  }
}
