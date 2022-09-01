/* eslint-disable class-methods-use-this */
import { ChemK } from "../core/ChemK";
import { Double, Int } from "../types";
import { strMass } from "../math/massUtils";
import { ChemCharge } from "../core/ChemCharge";
import { ChemOp } from "../core/ChemOp";
import { ChemComment } from "../core/ChemComment";
import { MarkupChunkType, markupFlat, parseMarkup } from "../utils/markup";

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
    return this.useMarkup(text);
  }

  custom(text: string): string {
    return this.useMarkup(text);
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
    return comm ? this.useMarkup(comm.text) : "";
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  markupSection(type: MarkupChunkType, isOpen: boolean): string {
    return "";
  }

  useMarkup(text: string): string {
    const topChunk = parseMarkup(text);
    let result = "";
    markupFlat(topChunk, ({ phase, chunk }) => {
      if (typeof chunk === "string") {
        result += chunk;
      } else if (phase === "open" || phase === "close") {
        const isOpen = phase === "open";
        if (!chunk.type && chunk.color) {
          result += isOpen ? this.colorBegin(chunk.color) : this.colorEnd();
        } else {
          result += this.markupSection(chunk.type, isOpen);
        }
      }
    });
    return result;
  }
}
