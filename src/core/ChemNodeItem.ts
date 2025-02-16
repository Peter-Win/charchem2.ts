import { Double, Int } from "../types";
import { ChemObj } from "./ChemObj";
import { ChemSubObj } from "./ChemSubObj";
import { ChemK } from "./ChemK";
import { Visitor } from "./Visitor";
import { ChemCharge } from "./ChemCharge";

export interface LewisDot {
  angle?: number;
  pos?: number; // [0;7] 0:Lb, 1:Br, 2:Bl, 3:Rb, 4:Rt, 5:Tl, 6:Tr, 7:Lt
  color?: string;
  margin?: number;
}

export class ChemNodeItem extends ChemObj {
  constructor(public readonly obj: ChemSubObj, public n: ChemK = ChemK.one) {
    super();
  }

  charge?: ChemCharge;

  // Special mass.
  // If specified, then ignore mass of sub object
  mass?: Double;

  atomNum?: Int | ""; // признак вывода атомного номера (для ядерных реакций).

  color?: string; // общий цвет

  atomColor?: string; // цвет атомов

  bCenter?: boolean; // признак приоритетности элемента, задаваемый при помощи обратного апострофа: H3C`O|

  dots?: LewisDot[];
  // this.dashes = [];

  override walk(visitor: Visitor) {
    visitor.itemPre?.(this);
    if (!visitor.isStop) this.obj.walk(visitor);
    if (!visitor.isStop) visitor.itemPost?.(this);
  }
}
