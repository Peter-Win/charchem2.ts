import { ChemCharge } from "../core/ChemCharge";
import { RulesBase } from "./RulesBase";

export class RulesText extends RulesBase {
  // eslint-disable-next-line class-methods-use-this
  nodeCharge({ isLeft, text }: ChemCharge): string {
    return isLeft ? `${text}^` : `^${text}`;
  }
}

/**
 * Правила для текстового представления формул.
 * Эти правила обеспечивают минимальный набор возможностей для отображения формул.
 * Например, CH3-CH2-OH
 * Для того чтобы получить больше возможностей, рекомендуется использовать другие правила.
 * Например, HTML или MathJax/mhchem.
 */
export const rulesText = Object.freeze(new RulesText());
