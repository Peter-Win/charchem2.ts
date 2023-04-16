import { Int } from "../../types";
import { ChemError } from "../../core/ChemError";
import { ChemAtom } from "../../core/ChemAtom";
import { ChemNode } from "../../core/ChemNode";
import { DraftGraph } from "../DraftGraph";
import { makeTextFormula } from "../../inspectors/makeTextFormula";

const valences: Record<string, Int> = {
  H: 1,
  D: 1,
  T: 1,
  Li: 1,
  B: 3,
  C: 4,
  N: 3,
  O: 2,
  F: 1,
  Na: 1,
  S: 2,
  Cl: 1,
  K: 1,
  Sb: 3,
  Te: 2,
  Br: 1,
  I: 1,
};

// Версия 2.
// Предполагается, что есть один центр, а остальные компоненты привязаны к нему: H3C-, -CN, -OH, -O-
export const draftGraphFromNode = (node: ChemNode): DraftGraph => {
  const g = new DraftGraph();
  const { items } = node;
  const center = node.getCenterItem();
  if (!center)
    throw new ChemError(`Invalid center of ${makeTextFormula(node)}`);

  items.forEach((item) => {
    const { obj } = item;
    if (!(obj instanceof ChemAtom))
      throw new ChemError(`Expected atom in ${makeTextFormula(node)}`);
    const valence = valences[obj.id];
    if (!valence) throw new ChemError(`Unknown valence of ${obj.id}`);
    if (!item.n.isInt())
      throw new ChemError(
        `Expected integer coefficient in ${makeTextFormula(node)}`
      );
    const n = item.n.num;
    for (let i = 0; i < n; i++) {
      g.vertices.push({
        content: obj,
        valence,
        reserved: item === center ? valence : 0,
        mass: item.mass,
      });
    }
  });

  // Центральный элемент может превратиться в несколько. Н.р. N2
  const cvList = g.vertices.filter(({ reserved }) => !!reserved);
  if (!cvList.length)
    throw new ChemError(`Invalid center of ${makeTextFormula(node)}`);
  if (cvList.length === 1) {
    const cv = cvList[0]!;
    if (node.charge) {
      const { value } = node.charge;
      cv.charge = value;
    }
    let left = true;
    g.vertices.forEach((v) => {
      if (v !== cv) {
        cv.reserved! -= v.valence;
        g.edges.push({
          v0: left ? v : cv,
          v1: left ? cv : v,
          mul: v.valence,
        });
      } else {
        left = false;
      }
    });
  } else if (cvList.length === 2 && g.vertices.length === 2) {
    cvList.forEach((v) => {
      // eslint-disable-next-line no-param-reassign
      v.reserved = 0;
    });
    g.edges.push({
      v0: cvList[0]!,
      v1: cvList[1]!,
      mul: cvList[0]!.valence,
    });
  } else {
    throw new Error(`Too many center items`);
  }
  return g;
};
