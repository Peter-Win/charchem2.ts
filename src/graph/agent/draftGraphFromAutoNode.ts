import { ChemError } from "../../core/ChemError";
import { ChemAtom } from "../../core/ChemAtom";
import { ChemNode } from "../../core/ChemNode";
import { DraftGraph, DraftVertex } from "../DraftGraph";

export const draftGraphFromAutoNode = (node: ChemNode): DraftGraph => {
  const g = new DraftGraph();
  const c = node.items[0];
  if (!c || !(c.obj instanceof ChemAtom) || c.obj.id !== "C")
    throw new ChemError("Expected C atom in auto node");
  const cv: DraftVertex = {
    content: c.obj,
    valency: 4,
  };
  g.verices.push(cv);
  const h = node.items[1];
  if (h) {
    if (!(h.obj instanceof ChemAtom) || h.obj.id !== "H")
      throw new ChemError("Expected H atom in auto node");
    if (!h.n.isInt()) throw new ChemError("Invalid H count in auto node");
    const hCount = h.n.num;
    for (let i = 0; i < hCount; i++) {
      const hv = {
        content: h.obj,
        valency: 1,
        reserved: 0,
      };
      g.verices.push(hv);
      g.edges.push({ v0: cv, v1: hv, mul: 1 });
    }
  }
  cv.reserved = 4 - g.edges.length;
  return g;
};
