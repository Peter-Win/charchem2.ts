/* eslint-disable class-methods-use-this */
import { Double, Int } from "../types";
import { ChemK } from "../core/ChemK";
import { RulesBase } from "./RulesBase";
import { strMass } from "../math/massUtils";
import { ChemCharge } from "../core/ChemCharge";

/**
 * Правила для формирования BB-кода представления формулы (для вставки в форумы)
 */
class RulesBB extends RulesBase {
  agentK(k: ChemK): string {
    return `[b]${k}[/b]`;
  }

  comment(text: string): string {
    return `[i]${text}[/i]`;
  }

  custom(text: string): string {
    return `[i]${text}[/i]`;
  }

  itemCount(k: ChemK): string {
    return `[sub]${k}[/sub]`;
  }

  itemMass(mass: Double): string {
    return `[sup]${strMass(mass)}[/sup]`;
  }

  itemMassAndNum(mass: Double, num: Int): string {
    return `[sup]${strMass(mass)}[/sup][sub]${num}[/sub]`;
  }

  nodeCharge(charge: ChemCharge): string {
    return `[sup]${charge.text}[/sup]`;
  }

  colorBegin(color: string): string {
    return `[color=${color}]`;
  }

  colorEnd(): string {
    return "[/color]";
  }
}

export const rulesBB = Object.freeze(new RulesBB());
