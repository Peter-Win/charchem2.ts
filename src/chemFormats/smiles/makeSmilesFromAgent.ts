import { ChemAgent } from "../../core/ChemAgent";
import { makeGraphFromAgent } from "../../graph/makeGraphFromAgent";
import { removeHydrogen } from "../../graph/removeHydrogens";
import { makeChemGraph } from "../../graph/makeChemGraph";
import { traceGraph, WithStep } from "../../graph/traceGraph";
import {
  buildSpanningTree,
  SpanningTreeNode,
} from "../../graph/buildSpanningTree";
import { ChemAtom } from "../../core/ChemAtom";
import { ChemError } from "../../core/ChemError";
import { Edge, otherVertex, Vertex } from "../../graph/ChemGraph";
import { Int } from "../../types";
import { PeriodicTable } from "../../core/PeriodicTable";
import { IsotopeId } from "../../types/ElementId";

const bondsMap: Record<number, string> = {
  0: ".",
  1: "-",
  1.5: ":",
  2: "=",
  3: "#",
  4: "$",
};

interface MakeSimilesOptions {
  forceSingleBonds?: boolean;
  forceAromaticBonds?: boolean;
  disableOrganicSubset?: boolean; // CH4 -> false(default): C, true: [C]([H])([H])([H])([H])
  hydrogen?: "hidden" | "included" | "separated"; // H2O => hidden(default): O, included: [OH2], separated: [H]O[H]
  expandCharge?: boolean; // Al^3+ -> false(default): [Al+3], true: [Al+++]
}

const makeBondSmiles = (edge: Edge, options?: MakeSimilesOptions): string => {
  const { mul } = edge;
  if (mul === 1 && !options?.forceSingleBonds) {
    // TODO: здесь еще нужен случай, когда одинарная связь соединяет два ароматических элемента: c1ccccc1-c2ccccc2
    return "";
  }
  const c = bondsMap[mul];
  if (!c) throw new ChemError(`Invalid chemical bond multiplicity ${mul}`);
  return c;
};

const organicSubset = new Set<string>([
  "B3",
  "C4",
  "N3",
  "N5",
  "O2",
  "P3",
  "P5",
  "S2",
  "S4",
  "S6",
  "F1",
  "Cl1",
  "Br1",
  "I1",
]);

const makeSmilesAtom = (
  vertex: Vertex,
  options?: MakeSimilesOptions
): string => {
  const { content, valence, hydrogen, charge, mass } = vertex;
  if (!(content instanceof ChemAtom)) {
    throw new ChemError("SMILES does not support abstract elements");
  }
  const { id } = content;
  let result: string = id;
  const idv = `${id}${valence}`;
  const hydrogenIncluded = !!hydrogen && options?.hydrogen === "included";
  if (
    options?.disableOrganicSubset ||
    !organicSubset.has(idv) ||
    hydrogenIncluded ||
    charge ||
    mass
  ) {
    const isotope = PeriodicTable.isotopesDict[id as IsotopeId];
    if (isotope) {
      result = `${Math.round(isotope.mass)}${
        PeriodicTable.elements[isotope.n - 1]!.id
      }`;
    }
    if (mass) {
      result = `${mass}${result}`;
    }
    if (hydrogen) {
      result += "H";
      if (hydrogen !== 1) result += String(hydrogen);
    }
    if (charge) {
      const sign = charge < 0 ? "-" : "+";
      const absCharge = Math.abs(charge);
      if (!options?.expandCharge) {
        result += sign;
        if (absCharge !== 1) result += String(absCharge);
      } else {
        result += sign.repeat(absCharge);
      }
    }
    result = `[${result}]`;
  }
  return result;
};

export const makeSmilesFromAgent = (
  agent: ChemAgent,
  options?: MakeSimilesOptions
): string => {
  const draftH = makeGraphFromAgent(agent);
  const draft =
    (options?.hydrogen ?? "hidden") !== "separated"
      ? removeHydrogen(draftH)
      : draftH;
  const graph = makeChemGraph<WithStep>(draft, { step: 0 }, {});
  traceGraph(graph);
  const tree = buildSpanningTree(graph);

  const usedLabels: Int[] = [];

  const strLabel = (nLabel: number): string =>
    nLabel < 10 ? String(nLabel) : `%${nLabel}`;

  const processNode = ({
    vertex,
    edge,
    branches,
  }: SpanningTreeNode): string => {
    let result = "";
    // bond
    if (edge) {
      result += makeBondSmiles(edge, options);
    }
    // element
    result += makeSmilesAtom(vertex, options);
    // closure label
    const { index: vIndex } = vertex;
    tree.closures.forEach((closure) => {
      if (vIndex === closure.v0 || vIndex === closure.v1) {
        const vi2 = otherVertex(closure, vIndex);
        const pos = usedLabels.findIndex((vi) => vi === vi2);
        if (pos >= 0) {
          result += strLabel(pos + 1);
        } else {
          usedLabels.push(vIndex);
          // Нужно указать свойства связи
          result += makeBondSmiles(closure, options);
          // И затем уже метку связи
          result += strLabel(usedLabels.length);
        }
      }
    });
    // branches
    branches.forEach((b) => {
      result += `(${processBranch(b)})`;
    });
    return result;
  };
  const processBranch = (nodes: SpanningTreeNode[]): string =>
    nodes.map(processNode).join("");
  return processBranch(tree.trunk);
};
