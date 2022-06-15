import { Double, Int } from "../types";
import { ChemObj } from "./ChemObj";
import { ChemSubObj } from "./ChemSubObj";
import { ChemK } from "./ChemK";
import { Visitor } from "./Visitor";

export class ChemNodeItem extends ChemObj {
  constructor(public readonly obj: ChemSubObj, public n: ChemK = ChemK.one) {
    super();
  }

  // Special mass.
  // If specified, then ignore mass of sub object
  mass: Double = 0.0;

  atomNum?: Int; // признак вывода атомного номера (для ядерных реакций).

  color?: String; // общий цвет

  atomColor?: String; // цвет атомов

  bCenter?: boolean; // признак приоритетности элемента, задаваемый при помощи обратного апострофа: H3C`O|
  // this.dots = [];
  // this.dashes = [];

  override walk(visitor: Visitor) {
    visitor.itemPre?.(this);
    if (!visitor.isStop) this.obj.walk(visitor);
    if (!visitor.isStop) visitor.itemPost?.(this);
  }
}
