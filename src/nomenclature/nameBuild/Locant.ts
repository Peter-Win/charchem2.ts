/**
 * Обычно локант - это просто число.
 * Но есть гораздо более сложные случаи:
 *   <i>N</i><sup>3</sup>
 *    2′a<sup>1</sup>
 *    2′<sup>4a</sup>
 *    <i>N</i>′<sup>4</sup>
 *    <i>N</i><sup>2′</sup>
 */
import { drawChunksList } from "../../utils/textFormats/drawChunksList";
import { TextFormat } from "../../utils/textFormats/TextFormat";
import { textFormatHtml } from "../../utils/textFormats/textFotmatHtml";
import { NomChunk, NomChunkMarkup, nomToTextChunk } from "../NomChunk";

export interface LocantPiece {
  value: number | string;
  primed?: number;
  markup?: NomChunkMarkup;
}

export const primedChar = "′";

export const locantPieceToChunk = ({
  value,
  primed,
  markup,
}: LocantPiece): NomChunk => ({
  text: `${value}${primedChar.repeat(primed || 0)}`,
  markup,
});

export class Locant {
  constructor(private pieces: LocantPiece[]) {}

  less(other: Locant): boolean {
    return Locant.less(this, other);
  }

  /**
   * P-14.3.5 of BlueBookV2
   * Primed locants are placed immediately after the corresponding unprimed locants in a set arranged in ascending order;
   * locants consisting of a number and a lower-case letter with or without primes as 4a and 4′a (not 4a′) are placed
   * immediately after the corresponding numeric locant and are followed by locants having superscripts.
   * Italic capital and lower-case letter locants are lower than Greek letter locants, which, in turn, are lower than numerals.
   */
  static less(a: Locant, b: Locant): boolean {
    /* eslint no-continue: "off" */
    const ap = a.pieces;
    const bp = b.pieces;
    const len = Math.max(ap.length, bp.length);
    for (let i = 0; i < len; i++) {
      const ac = ap[i];
      const bc = bp[i];
      if (ac && bc) {
        const av = ac.value;
        const bv = bc.value;
        if (ac.markup === "italic") {
          if (bc.markup !== "italic") return true;
          if (av === bv) continue;
          return av < bv;
        }
        if (typeof av === "string" && typeof bv === "number") return true;
        if (av === bv) {
          // 4′ is lower than 4a
          if (ac.primed && !bc.primed && !ap[i + 1] && bp[i + 1]) return true;
          if (!ac.primed && bc.primed && ap[i + 1] && !bp[i + 1]) return false;
          if (ac.primed !== bc.primed)
            return (ac.primed || 0) < (bc.primed || 0);
          continue;
        }
        return av < bv;
      }
      if (!ac) {
        return true;
      }
    }
    return false;
  }

  static create(value: number | string, primed?: number) {
    const list: LocantPiece[] = [];
    if (typeof value === "number") {
      list.push({ value });
    } else if (/^[A-Z]$/.test(value)) {
      list.push({ value, markup: "italic" });
    } else if (/^\d+[a-z]$/.test(value)) {
      list.push({ value: +value.slice(0, -1) }, { value: value.slice(-1) });
    } else {
      list.push({ value });
    }
    if (primed && list.length > 0) {
      list[list.length - 1]!.primed = primed;
    }
    return new Locant(list);
  }

  makeChunks(): NomChunk[] {
    return this.pieces.map(locantPieceToChunk);
  }

  toString(format: TextFormat = textFormatHtml): string {
    return drawChunksList(this.makeChunks().map(nomToTextChunk), format);
  }
}
