/* eslint-disable class-methods-use-this */
import { Char, Double, Int } from "../types";
import { RulesBase } from "./RulesBase";
import { ChemK } from "../core/ChemK";
import { strMass } from "../math/massUtils";
import { ChemCharge } from "../core/ChemCharge";
import { ChemOp } from "../core/ChemOp";
import { ifDef } from "../utils/ifDef";

/*
Эти правила дают не очень качественный результат.
Пока нет поддержки цветов. И некрасиво выводятся операции с подписями
 */

const specialCharacters = new Set([
  "'",
  "*",
  ":",
  "\\",
  "_",
  "{",
  "|",
  "}",
  "~",
]);

const rtfChar = (src: Char): string => {
  if (specialCharacters.has(src)) return `\\${src}`;
  const code = src.charCodeAt(0);
  if (code > 127) return `{\\cf2\\rtlch \\ltrch\\loch \\u${code}\\'3f}`;
  return `${src}`;
};

const escapeRTF = (text: string): string =>
  Array.from(text).reduce((src, c) => src + rtfChar(c), "");

const subRTF = (text: string): string => `{\\sub ${escapeRTF(text)}}`;
const supRTF = (text: string): string => `{\\super ${escapeRTF(text)}}`;

class RulesRTF extends RulesBase {
  agentK(k: ChemK): string {
    return escapeRTF(String(k));
  }

  atom(id: string): string {
    return id;
  }

  comment(text: string): string {
    return escapeRTF(text);
  }

  custom(text: string): string {
    return escapeRTF(text);
  }

  itemCount(k: ChemK): string {
    return subRTF(String(k));
  }

  itemMass(mass: Double): string {
    return supRTF(strMass(mass));
  }

  itemMassAndNum(mass: Double, num: Int): string {
    return supRTF(strMass(mass)) + subRTF(String(num));
  }

  nodeCharge(charge: ChemCharge): string {
    return supRTF(charge.text);
  }

  operation(op: ChemOp): string {
    // Пока не удалось найти нормальную реализацию для размещения комментов над и под стрелкой
    let result = "";
    ifDef(op.commentPre, (it) => {
      result += supRTF(it.text);
    });
    result += escapeRTF(op.dstText);
    ifDef(op.commentPost, (it) => {
      result += subRTF(it.text);
    });
    return result;
  }

  radical(label: string): string {
    return escapeRTF(label);
  }
}

export const rulesRTF = Object.freeze(new RulesRTF());

/*
Для поддержки цветов нужно вставить таблицу цветов
{\colortbl;\red0\green0\blue0;\red255\green0\blue0;}
Н.р, для красного цвета: {\cf2 this is red text}
 */
