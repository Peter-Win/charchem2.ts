import { Int } from "../../types";
import { ChemError } from "../../core/ChemError";
import { ChemAtom } from "../../core/ChemAtom";
import { ChemNode } from "../../core/ChemNode";
import { DraftGraph, DraftVertex } from "../DraftGraph";

const valences: Record<string, Int> = {
  H: 1,
  C: 4,
  O: 2,
};

// Пока очень простая реализация, похожая на автоузел
export const draftGraphFromNode = (node: ChemNode): DraftGraph => {
  const g = new DraftGraph();
  const { items } = node;

  const first = items[0];
  if (!first || !(first.obj instanceof ChemAtom) || !first.n.equals(1)) {
    throw new ChemError("Invalid node");
  }
  const val1 = valences[first.obj.id];
  if (!val1) throw new ChemError("Invalid node");

  const vertex1: DraftVertex = {
    content: first.obj,
    valency: val1,
    reserved: val1,
  };
  g.verices.push(vertex1);

  const second = items[1];
  if (second) {
    if (!(second.obj instanceof ChemAtom) || !second.n.isInt()) {
      throw new ChemError("Invalid node");
    }
    const n = second.n.num;
    const val2 = valences[second.obj.id];
    if (!val2) throw new ChemError("Invalid node");
    vertex1.reserved = vertex1.valency - n * val2;
    if (vertex1.reserved < 0) throw new ChemError("Invalid node");
    for (let i = 0; i < n; i++) {
      const vi: DraftVertex = {
        content: second.obj,
        valency: val2,
      };
      g.verices.push(vi);
      g.edges.push({
        v0: vertex1,
        v1: vi,
        mul: val2,
      });
    }
  }
  if (items.length > 2) throw new ChemError("Invalid node");

  return g;
};
