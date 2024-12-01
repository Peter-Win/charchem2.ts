import { RulesBase } from "./RulesBase";
import { rulesBB } from "./rulesBB";
import { rulesCharChem } from "./rulesCharChem";
import { rulesHtml } from "./rulesHtml";
import { rulesMhchem } from "./rulesMhchem";
import { rulesRTF } from "./rulesRTF";
import { rulesText } from "./rulesText";

export const dictTextRules = {
  bb: rulesBB,
  charChem: rulesCharChem,
  html: rulesHtml,
  mhchem: rulesMhchem,
  rtf: rulesRTF,
  text: rulesText,
} satisfies Record<string, RulesBase>;
