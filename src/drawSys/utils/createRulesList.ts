import { RulesHtml } from "../../textRules/rulesHtml";
import { ChemK } from "../../core/ChemK";
import { ChemCharge } from "../../core/ChemCharge";
import { ChemStyleId } from "../ChemStyleId";
import { ChemImgProps } from "../ChemImgProps";

export const createRulesList = (rules: RulesHtml) => {
  const k = new ChemK(9);
  const list: [ChemStyleId, string][] = [
    ["agentK", rules.agentK(k)],
    ["comment", rules.comment("A")],
    ["custom", rules.custom("A")],
    ["itemCount", rules.itemCount(k)],
    ["itemMass", rules.itemMass(9)],
    ["nodeCharge", rules.nodeCharge(new ChemCharge("9", 9))],
    ["bracketCharge", rules.bracketCharge(new ChemCharge("9", 9))],
    ["bracketCount", rules.bracketCount(k)],
  ];
  // Не вошедшие в список стили, которые являются индексами, считаются такими же как коэффициент элемента
  const used = new Set<ChemStyleId>(list.map(([id]) => id));
  ChemImgProps.getIndexStyles().forEach((styleId) => {
    if (!used.has(styleId)) list.push([styleId, rules.itemCount(k)]);
  });
  return list;
};
