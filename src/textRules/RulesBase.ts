/* eslint-disable class-methods-use-this */
import { ChemK } from "../core/ChemK";
import { Double, Int } from "../types";
import { strMass } from "../math/massUtils";
import { ChemCharge } from "../core/ChemCharge";
import { ChemOp } from "../core/ChemOp";
import { ChemComment } from "../core/ChemComment";

export class RulesBase {
  agentK(k: ChemK): string {
    return k.toString();
  }

  atom(id: string): string {
    return id;
  }

  comma(): string {
    return ",";
  }

  comment(text: string): string {
    return text;
  }

  custom(text: string): string {
    return text;
  }

  itemCount(k: ChemK): string {
    return k.toString();
  }

  itemMass(mass: Double): string {
    return strMass(mass);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemMassAndNum(mass: Double, number: Int): string {
    return "";
  }

  nodeCharge(charge: ChemCharge): string {
    return charge.text;
  }

  operation(op: ChemOp): string {
    return `${this.opComment(op.commentPre)}${op.dstText}${this.opComment(
      op.commentPost
    )}`;
  }

  opComment(comm?: ChemComment): string {
    return comm ? comm.text : "";
  }

  postProcess(text: string): string {
    return text;
  }

  radical(label: string): string {
    return label;
  }

  mul(): string {
    return "∙";
  }

  mulK(k: ChemK): string {
    return String(k);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colorBegin(color: string): string {
    return "";
  }

  colorEnd(): string {
    return "";
  }
}
