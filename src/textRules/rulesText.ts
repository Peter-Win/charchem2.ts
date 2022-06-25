import { RulesBase } from "./RulesBase";

/**
 * Правила для текстового представления формул.
 * Эти правила обеспечивают минимальный набор возможностей для отображения формул.
 * Например, CH3-CH2-OH
 * Для того чтобы получить больше возможностей, рекомендуется использовать другие правила.
 * Например, HTML или MathJax/mhchem.
 */
export const rulesText = Object.freeze(new RulesBase());