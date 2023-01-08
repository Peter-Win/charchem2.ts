/**
 * Elements list
 * Each element is record {id, elem, n}
 * For abstract  elem is null
 * Created by PeterWin on 29.04.2017.
 */
import { ElemRecord } from "./ElemRecord";
import { Double } from "../types";
import { ElementId, IsotopeId } from "../types/ElementId";
import { makeChargeText } from "./makeChargeText";
import { ChemAtom } from "./ChemAtom";
import { findElement } from "./PeriodicTable";
import { ChemRadical } from "./ChemRadical";

export class ElemList {
  readonly list: ElemRecord[] = [];

  charge: Double = 0.0;

  toString() {
    let result: string = this.list.reduce(
      (acc, elemRec) => `${acc}${elemRec}`,
      ""
    );
    const chargeText = makeChargeText(this.charge);
    if (chargeText !== "") {
      result += `^${chargeText}`;
    }
    return result;
  }

  findAtom(atom?: ChemAtom): ElemRecord | undefined {
    return atom ? this.list.find((it) => it.elem === atom) : undefined;
  }

  // Example: list.findById("He")
  findById(id: ElementId | IsotopeId): ElemRecord | undefined {
    return this.findAtom(findElement(id));
  }

  findCustom(id: string): ElemRecord | undefined {
    return this.list.find((it) => !it.elem && it.id === id);
  }

  findKey(key: string): ElemRecord | undefined {
    return this.list.find((it) => it.key === key);
  }

  findRec(rec?: ElemRecord): ElemRecord | undefined {
    if (!rec) return undefined;
    return rec.elem ? this.findAtom(rec.elem) : this.findCustom(rec.id);
  }

  private addElemRec(rec: ElemRecord): this {
    const foundRec = this.findRec(rec);
    if (!foundRec) {
      this.list.push(rec);
    } else {
      foundRec.n += rec.n;
    }
    return this;
  }

  addElemById(id: string, n: Double = 1.0): this {
    return this.addElemRec(new ElemRecord(id, n, false));
  }

  addAtom(atom: ChemAtom, n: Double = 1.0): this {
    return this.addElemRec(new ElemRecord(atom, n));
  }

  addElem(elem: ElemRecord, n: Double = 1.0): this {
    return this.addElemRec(new ElemRecord(elem, n));
  }

  addCustom(text: string, n: Double = 1.0): this {
    return this.addElemRec(new ElemRecord(text, n, true));
  }

  addList(srcList: ElemList): this {
    srcList.list.forEach((it) => this.addElem(it));
    this.charge += srcList.charge;
    return this;
  }

  addRadical(radical?: ChemRadical): this {
    return radical ? this.addList(radical.items) : this;
  }

  scale(k: Double) {
    if (k !== 1.0) {
      this.charge *= k;
      this.list.forEach((it) => {
        // eslint-disable-next-line no-param-reassign
        it.n *= k;
      });
    }
  }

  // sort by Hill system
  sortByHill() {
    this.list.sort((a: ElemRecord, b: ElemRecord): number => {
      const aid: string = a.id;
      const bid: string = b.id;
      if (!a.elem && !b.elem) return aid.localeCompare(bid);
      if (!a.elem) return 1;
      if (!b.elem) return -1;
      if (aid === bid) return 0;
      if (aid === "C") return -1;
      if (bid === "C") return 1;
      if (aid === "H") return -1;
      if (bid === "H") return 1;
      return aid.localeCompare(bid);
    });
  }
}
