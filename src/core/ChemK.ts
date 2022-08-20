// Chemical Coefficient.
// Can be number or string (abstract coefficient: C'n'H'2n+2')
import { Double } from "../types";
import { toa } from "../math";
import { CoeffPos } from "../types/CoeffPos";

export class ChemK {
  readonly num: Double;

  readonly text: string;

  pos?: CoeffPos;

  constructor(n: Double, pos?: CoeffPos);

  constructor(text: string, pos?: CoeffPos);

  constructor(k: number | string, pos?: CoeffPos) {
    if (typeof k === "number") {
      this.num = k;
      this.text = "";
    } else {
      this.text = k;
      this.num = NaN;
    }
    this.pos = pos;
  }

  static readonly one = new ChemK(1);

  // Na2S.  Is specified for Na and not for S
  isSpecified() {
    return !!this.text || (this.num !== 1 && !Number.isNaN(this.num));
  }

  isNumber() {
    return !Number.isNaN(this.num);
  }

  equals(k: ChemK | string | number): boolean {
    if (typeof k === "number" && this.isNumber()) {
      return this.num === k;
    }
    if (typeof k === "string" && !this.isNumber()) {
      return this.text === k;
    }
    if (k instanceof ChemK) {
      return this.text ? this.text === k.text : this.num === k.num;
    }
    return false;
  }

  toString() {
    return this.isNumber() ? toa(this.num) : this.text;
  }
}
