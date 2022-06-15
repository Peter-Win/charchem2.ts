import { ChemSubObj } from "./ChemSubObj";
import { Visitor } from "./Visitor";
import { ElementId } from "../types/ElementId";
import { Int } from "../types";
import { ElemList } from "./ElemList";

let radicals: Record<string, ChemRadical> | null = null;

type DescrRec = [ElementId, Int];
type DescrItem = [string[], DescrRec[]];
const descriptions: DescrItem[] = [
  [
    ["Me"],
    [
      ["C", 1],
      ["H", 3],
    ],
  ],
  [
    ["Et"],
    [
      ["C", 2],
      ["H", 5],
    ],
  ],
  [
    ["Ph"],
    [
      ["C", 6],
      ["H", 5],
    ],
  ],
  [
    ["Pr", "n-Pr", "Pr-n"],
    [
      ["C", 3],
      ["H", 7],
    ],
  ],
  [
    ["iPr", "i-Pr", "Pr-i"],
    [
      ["C", 3],
      ["H", 7],
    ],
  ],
  [
    ["Bu", "nBu", "n-Bu", "Bu-n"],
    [
      ["C", 4],
      ["H", 9],
    ],
  ],
  [
    ["t-Bu", "Bu-t"],
    [
      ["C", 4],
      ["H", 9],
    ],
  ],
  [
    ["i-Bu", "Bu-i"],
    [
      ["C", 4],
      ["H", 9],
    ],
  ],
  [
    ["Ac"],
    [
      ["C", 1],
      ["H", 3],
      ["C", 1],
      ["O", 1],
    ],
  ],
  [
    ["CoA"],
    [
      ["C", 21],
      ["H", 35],
      ["N", 7],
      ["O", 16],
      ["P", 3],
    ],
  ], // https://en.wikipedia.org/wiki/Coenzyme_A
  [
    ["Tf"],
    [
      ["C", 1],
      ["F", 3],
      ["S", 1],
      ["O", 2],
    ],
  ], // TfOH = CF3SO3H, Tf = CF3SO2 https://en.wikipedia.org/wiki/Trifluoromethylsulfonyl
  // MsOH https://en.wikipedia.org/wiki/Methanesulfonic_acid
];

export class ChemRadical extends ChemSubObj {
  constructor(public readonly label: string, public readonly items: ElemList) {
    super();
  }

  override walk(visitor: Visitor) {
    visitor.radical?.(this);
  }

  static get dict(): Record<string, ChemRadical> {
    if (radicals) return radicals;
    const newDict: Record<string, ChemRadical> = {};
    descriptions.forEach((descr) => {
      const [left, right] = descr;
      const elemList = new ElemList();
      right.forEach(([id, n]) => elemList.addElemById(id, n));
      left.forEach((it) => {
        newDict[it] = new ChemRadical(it, elemList);
      });
    });
    radicals = newDict;
    return newDict;
  }
}
