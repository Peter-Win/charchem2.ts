import { Double } from "../types";
import { romanNum } from "../utils/romanNum";

export class ChemCharge {
  readonly text: string; // Text description, for example: '2+'

  readonly value: Double; // number value, for example: 2

  readonly isLeft: boolean; // ⁺N

  readonly isRound: boolean; // A sign of drawing a charge inside a circle

  constructor(text: string, value: Double, isLeft = false, isRound = false) {
    this.text = text;
    this.value = value;
    this.isLeft = isLeft;
    this.isRound = isRound;
  }
}

const leftSigned = /(^|(^[-+]))\d+$/;
const rightSigned = /^\d+[-+]$/;
const minuses = new Set(["-", "--", "---"]);
const pluses = new Set(["+", "++", "+++"]);

/**
 * Create charge object from text description
 * Особенностью любого текстового описания заряда в том, что при компиляции происходят попытки,
 * начиная с одного символа и увеличивая количество символов до тех пор, пока это валидное выражение.
 * То есть, не может быть такого, что двухсимвольное описание валидно, а односимвольное - нет.
 */
export const createCharge = (
  chargeDescr: string,
  isLeft = false
): ChemCharge | null => {
  if (chargeDescr === "") return null;
  const text = chargeDescr // Replace similar characters
    .replace("–", "-") // \u2013
    .replace("−", "-"); // \u2212
  // One or more minuses:	O^--
  if (minuses.has(text)) return new ChemCharge(text, -text.length, isLeft);
  // One or more pluses: Zn^++
  if (pluses.has(text)) return new ChemCharge(text, text.length, isLeft);
  // A number with a plus or minus front: S^+6, O^-2
  if (leftSigned.test(text)) return new ChemCharge(text, +text, isLeft);
  // A number with plus or minus behind: Ca^2+, PO4^3-
  if (rightSigned.test(text))
    return new ChemCharge(
      text,
      +`${text.slice(-1)}${text.slice(0, -1)}`,
      isLeft
    );
  if (text === "+o") return new ChemCharge("+", 1.0, isLeft, true);
  if (text === "-o") return new ChemCharge("-", -1.0, isLeft, true);
  const v = romanNum[text];
  if (v) return new ChemCharge(text.toUpperCase(), v, isLeft);
  return null;
};
