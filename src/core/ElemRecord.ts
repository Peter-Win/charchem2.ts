import { Double } from "../types";
import { ChemAtom } from "./ChemAtom";
import { findElement } from "./PeriodicTable";
import { k2s } from "./k2s";

export class ElemRecord {
  readonly id: string;

  readonly elem?: ChemAtom;

  n: Double;

  constructor(id: string);

  constructor(id: string, n: Double, isCustom: boolean);

  constructor(atom: ChemAtom);

  constructor(atom: ChemAtom, n: Double);

  constructor(src: ElemRecord);

  constructor(src: ElemRecord, n: Double);

  constructor(
    a: string | ChemAtom | ElemRecord,
    n: Double = 1.0,
    isCustom: boolean = false
  ) {
    if (typeof a === "string") {
      this.id = a;
      this.elem = isCustom ? undefined : findElement(a);
      this.n = n;
    } else if (a instanceof ChemAtom) {
      this.id = a.id;
      this.elem = a;
      this.n = n;
    } else {
      this.id = a.id;
      this.elem = a.elem;
      this.n = n * a.n;
    }
  }

  get key(): string {
    return this.elem ? this.id : `{${this.id}}`;
  }

  toString() {
    return `${this.key}${k2s(this.n)}`;
  }
}
