/* eslint-disable class-methods-use-this */
import { RulesBase } from "./RulesBase";
import { Int, Double } from "../types";
import { ChemK } from "../core/ChemK";
import { strMass } from "../math/massUtils";
import { ChemCharge } from "../core/ChemCharge";
import { ChemOp } from "../core/ChemOp";
import { ChemComment } from "../core/ChemComment";

/*
Следует учесть, что это не полноценная система обратного преобразования выражения в текст формулы.
Здесь действуют те же ограничения, что и для остальных правил: формула должна быть текстовой(линейной)
 */

const exportCoeff = (k: ChemK) => (k.isNumber() ? String(k) : `'${k}'`);

class RulesCharChem extends RulesBase {
  agentK(k: ChemK): string {
    return exportCoeff(k);
  }

  comment(text: string): string {
    return `"${text}"`;
  }

  custom(text: string): string {
    return `{${text}}`;
  }

  itemCount(k: ChemK): string {
    return exportCoeff(k);
  }

  itemMass(mass: Double): string {
    return `$M(${strMass(mass)})`;
  }

  itemMassAndNum(mass: Double, num: Int): string {
    return `$nM(${strMass(mass)},${num})`;
  }

  nodeCharge(charge: ChemCharge): string {
    return `^${charge.text}`;
  }

  operation(op: ChemOp): string {
    return `${this.opComment(op.commentPre)}${op.srcText}${this.opComment(
      op.commentPost
    )}`;
  }

  opComment(comm?: ChemComment): string {
    return comm ? this.comment(comm.text) : "";
  }

  postProcess(text: string): string {
    return text.replace(/\$color\(\)\$color/g, "$color");
  }

  radical(label: string): string {
    return this.custom(label);
  }

  mul(): string {
    return "*";
  }

  mulK(k: ChemK): string {
    return exportCoeff(k);
  }

  colorBegin(color: string): string {
    return `$color(${color})`;
  }

  colorEnd(): string {
    return "$color()";
  }
}

export const rulesCharChem = Object.freeze(new RulesCharChem());
