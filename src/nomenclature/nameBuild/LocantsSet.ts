import { Locant } from "./Locant";
import { TextFormat } from "../../utils/textFormats/TextFormat";
import { textFormatHtml } from "../../utils/textFormats/textFotmatHtml";
import { cmpLess } from "../../utils/cmp";

export class LocantsSet {
  constructor(public readonly locants: Locant[]) {}

  sort(): this {
    this.locants.sort(cmpLess(Locant.less));
    return this;
  }

  static createNums(nums: number[]): LocantsSet {
    return new LocantsSet(nums.map((n) => Locant.create(n)));
  }

  static create(defs: [string | number, number?][]): LocantsSet {
    return new LocantsSet(defs.map(([v, p]) => Locant.create(v, p)));
  }

  // BlueBookV2
  // P-14.3.5 Lowest set of locants
  static less(a: LocantsSet, b: LocantsSet): boolean {
    const aList = a.locants;
    const bList = b.locants;
    const len = Math.max(aList.length, bList.length);
    for (let i = 0; i < len; i++) {
      const aLoc = aList[i];
      const bLoc = bList[i];
      if (aLoc && bLoc) {
        if (aLoc.less(bLoc)) return true;
        if (bLoc.less(aLoc)) return false;
      } else if (!aLoc) {
        return true;
      } else if (!bLoc) {
        return false;
      }
    }
    return false;
  }

  less(other: LocantsSet): boolean {
    return LocantsSet.less(this, other);
  }

  toString(format: TextFormat = textFormatHtml): string {
    return this.locants.map((loc) => loc.toString(format)).join(",");
  }
}
