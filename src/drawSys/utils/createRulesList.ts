import { RulesHtml } from "../../textRules/rulesHtml";
import { ChemK } from "../../core/ChemK";
import { ChemCharge } from "../../core/ChemCharge";
import { ChemStyleId } from "../ChemStyleId";

export const createRulesList = (rules: RulesHtml) => {
  const k = new ChemK(9);
  const list: [ChemStyleId, string][] = [
    ["agentK", rules.agentK(k)],
    ["comment", rules.comment("A")],
    ["custom", rules.custom("A")],
    ["itemCount", rules.itemCount(k)],
    ["itemMass", rules.itemMass(9)],
    ["nodeCharge", rules.nodeCharge(new ChemCharge("9", 9))],
  ];
  return list;
};
