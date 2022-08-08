/* eslint-disable class-methods-use-this */
import { Double, Int } from "../types";
import { RulesBase } from "./RulesBase";
import { ChemK } from "../core/ChemK";
import { strMass } from "../math/massUtils";
import { drawTag } from "../utils/xml/drawTag";
import { escapeXml } from "../utils/xml/escapeXml";
import { ChemCharge } from "../core/ChemCharge";
import { ChemOp } from "../core/ChemOp";
import { ChemComment } from "../core/ChemComment";

/**
 * Правила для формирования HTML-представления формулы
 * Важно учесть, что полученная разметка предполагает использование определенных правил CSS
 * Их можно скачать тут
 *   http://charchem.org/download/charchem.css
 *
 * Различные части формулы оборачиваются специальными тегами, чтобы их было проще кастомизировать.
 * <b/> - Коэффициент агента
 * <em/> - Текстовый комментарий
 * <i/> - Абстрактные функциональные группы, н.р. {R}OH
 * <sub/> - Подстрочные коэффициенты
 * <span class="echem-op"/> - Операции в химических выражениях
 */
export class RulesHtml extends RulesBase {
  agentK(k: ChemK): string {
    return `<b>${k}</b>`;
  }

  comment(text: string): string {
    return `<em>${text}</em>`;
  }

  custom(text: string): string {
    return `<i>${text}</i>`;
  }

  itemCount(k: ChemK): string {
    return `<sub>${k}</sub>`;
  }

  itemMass(mass: Double): string {
    return `<sup>${strMass(mass)}</sup>`;
  }

  itemMassAndNum(mass: Double, num: Int): string {
    return `${drawTag("span", { class: "echem-mass-and-num" })}${strMass(
      mass
    )}<br/>${num}</span>`;
  }

  nodeCharge(charge: ChemCharge): string {
    return `<sup>${charge.text}</sup>`;
  }

  operation(op: ChemOp): string {
    let result = drawTag("span", { class: "echem-op" });
    result += this.opComment(op.commentPre);
    switch (op.srcText) {
      case "-->":
        result += `<span class="chem-long-arrow">→</span>`;
        break;
      case "<==>":
        result += `<span class="chem-long-arrow">\u21CC</span>`;
        break;
      default:
        result += op.dstText;
        break;
    }
    result += this.opComment(op.commentPost);
    return `${result}</span>`;
  }

  opComment(comm?: ChemComment): string {
    return comm
      ? `<span class="echem-opcomment">${escapeXml(comm.text)}</span>`
      : "";
  }

  colorBegin(color: string): string {
    return `<span style="color:${escapeXml(color)}">`;
  }

  colorEnd(): string {
    return "</span>";
  }
}

export const rulesHtml = Object.freeze(new RulesHtml());
