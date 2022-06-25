/* eslint-disable class-methods-use-this */
import { Double, Int } from "../types";
import { ChemK } from "../core/ChemK";
import { RulesBase } from "./RulesBase";
import { strMass } from "../math/massUtils";
import { ChemCharge } from "../core/ChemCharge";
import { ChemOp } from "../core/ChemOp";

const opDict: Record<string, string> = {
  "-->": "->",
  "<=>": "<-->",
  "<==>": "<-->",
};

// MathJax/mhchem
// https://mhchem.github.io/MathJax-mhchem/

class RulesMhchem extends RulesBase {
  // Возможно, нужны разные правила для чисел, дробных чисел и абстрактных значений
  agentK(k: ChemK) {
    return String(k);
  }

  itemCount(k: ChemK): string {
    return `_{${k}}`;
  }

  itemMass(mass: Double): string {
    return `^{${strMass(mass)}}`;
  }

  itemMassAndNum(mass: Double, num: Int): string {
    return `^{${strMass(mass)}}_{${num}}`;
  }

  nodeCharge(charge: ChemCharge): string {
    return `^{${charge.text}}`;
  }

  operation(op: ChemOp): string {
    let result: string = opDict[op.srcText] ?? op.srcText;
    const t1 = op.commentPre;
    const t2 = op.commentPost;
    if (t1 || t2) {
      result += `[{${t1?.text ?? ""}}]`;
    }
    if (t2) {
      result += `[{${t2.text}}]`;
    }
    return result;
  }

  mul() {
    return "*";
  }

  colorBegin(color: string): string {
    return `\\color{${color}}{`;
  }

  colorEnd() {
    return "}";
  }
}

export const rulesMhchem = Object.freeze(new RulesMhchem());
