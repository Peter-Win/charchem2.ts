import { Int } from "../types";
import { Point } from "../math/Point";
import { ChemCharge } from "./ChemCharge";
import { ChemChargeOwner } from "./ChemChargeOwner";
import { ChemObj } from "./ChemObj";
import { ChemNodeItem } from "./ChemNodeItem";
import { ChemBond } from "./ChemBond";
import { Visitor } from "./Visitor";

/**
 * Priority table for different items
 * 1 = comment
 * 2 = abstract item
 * 3 = H element
 * 4 = radicals and all elements (except C and H)
 * 5 = C element
 * 6 = item with bCenter flag
 */
const enum ItemPriority {
  NA,
  Comment,
  Abstract,
  Hydrogen,
  Default,
  Carbon,
  Explicit,
}

export class ChemNode extends ChemObj implements ChemChargeOwner {
  constructor(pt?: Point) {
    super();
    this.pt = (pt ?? Point.zero).clone();
  }

  pt: Point;

  charge: ChemCharge | null = null;

  items: ChemNodeItem[] = [];

  index: Int = -1; // index of node in CAgent.nodes array

  chain: Int = 0; // chain number

  subChain: Int = 0;

  autoMode = false;

  bonds: Set<ChemBond> = new Set();

  fixed = false;

  color?: string;

  atomColor?: string;

  override walk(visitor: Visitor) {
    visitor.nodePre?.(this);
    if (visitor.isStop) return;
    for (const it of this.items) {
      it.walk(visitor);
      if (visitor.isStop) return;
    }
    visitor.nodePost?.(this);
  }

  addBond(bond: ChemBond) {
    this.bonds.add(bond);
  }

  getCenterItem(): ChemNodeItem | null {
    let curPriority = ItemPriority.NA;
    let maxPriority = ItemPriority.NA;
    let foundItem: ChemNodeItem | null = null;
    this.walk({
      itemPre() {
        curPriority = ItemPriority.NA;
      },
      comment() {
        curPriority = ItemPriority.Comment;
      },
      custom() {
        curPriority = ItemPriority.Abstract;
      },
      radical() {
        curPriority = ItemPriority.Default;
      },
      atom(obj) {
        switch (obj.id) {
          case "H":
            curPriority = ItemPriority.Hydrogen;
            break;
          case "C":
            curPriority = ItemPriority.Carbon;
            break;
          default:
            curPriority = ItemPriority.Default;
            break;
        }
      },
      itemPost(obj) {
        if (obj.bCenter) {
          curPriority = ItemPriority.Explicit;
        }
        if (curPriority > maxPriority) {
          maxPriority = curPriority;
          foundItem = obj;
        }
      },
    });
    return foundItem;
  }
}
