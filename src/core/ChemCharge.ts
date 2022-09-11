import { CoeffPosOrAngle, isLeftCoeffA } from "../types/CoeffPos";
import { Double } from "../types";
import { romanNum } from "../utils/romanNum";

export class ChemCharge {
  get isLeft(): boolean {
    // ⁺N
    return isLeftCoeffA(this.pos);
  }

  constructor(
    public readonly text: string, // Text description, for example: '2+'
    public readonly value: Double, // number value, for example: 2
    public readonly pos: CoeffPosOrAngle = "RT", // relative position of charge from $pos()
    public readonly isRound: boolean = false // A sign of drawing a charge inside a circle
  ) {}
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
  pos: CoeffPosOrAngle = "RT"
): ChemCharge | undefined => {
  if (chargeDescr === "") return undefined;
  const text = chargeDescr // Replace similar characters
    .replace("–", "-") // \u2013
    .replace("−", "-"); // \u2212
  // One or more minuses:	O^--
  if (minuses.has(text)) return new ChemCharge(text, -text.length, pos);
  // One or more pluses: Zn^++
  if (pluses.has(text)) return new ChemCharge(text, text.length, pos);
  // A number with a plus or minus front: S^+6, O^-2
  if (leftSigned.test(text)) return new ChemCharge(text, +text, pos);
  // A number with plus or minus behind: Ca^2+, PO4^3-
  if (rightSigned.test(text))
    return new ChemCharge(text, +`${text.slice(-1)}${text.slice(0, -1)}`, pos);
  if (text === "+o") return new ChemCharge("+", 1.0, pos, true);
  if (text === "-o") return new ChemCharge("-", -1.0, pos, true);
  const v = romanNum[text];
  if (v) return new ChemCharge(text.toUpperCase(), v, pos);
  return undefined;
};
