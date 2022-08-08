/* eslint-disable max-classes-per-file */
import { ChemBond } from "./ChemBond";
import { ChemObj } from "./ChemObj";
import { Visitor } from "./Visitor";
import { ChemChargeOwner } from "./ChemChargeOwner";
import { ChemCharge } from "./ChemCharge";
import { ChemNode, ChemNodeOptPair } from "./ChemNode";
import { ChemK } from "./ChemK";

// Pairs of open and closed brackets
export const bracketPairs: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{[": "]}",
};

export interface CommonBracket {
  text: string;
  color?: string;
  nodes: ChemNodeOptPair;
  bond?: ChemBond;
}

export class ChemBracketBegin extends ChemObj implements CommonBracket {
  constructor(public readonly text: string) {
    super();
  }

  end?: ChemBracketEnd;

  isText?: boolean;

  bond?: ChemBond;

  color?: string;

  nodes: ChemNodeOptPair = [undefined, undefined];

  override walk(visitor: Visitor) {
    visitor.bracketBegin?.(this);
  }
}

export class ChemBracketEnd
  extends ChemObj
  implements ChemChargeOwner, CommonBracket
{
  constructor(
    public readonly text: string,
    public readonly begin: ChemBracketBegin,
    nodeIn: ChemNode
  ) {
    super();
    this.nodes[0] = nodeIn;
  }

  charge?: ChemCharge = undefined;

  n: ChemK = new ChemK(1);

  bond?: ChemBond;

  nodes: ChemNodeOptPair = [undefined, undefined];

  // this.bond = null
  override walk(visitor: Visitor) {
    visitor.bracketEnd?.(this);
  }

  get nodeIn() {
    return this.nodes[0];
  }

  get color(): string | undefined {
    return this.begin.color;
  }
}

export const getBracketsContent = (
  begin: ChemBracketBegin,
  commands: ChemObj[]
): ChemObj[] => {
  const { end } = begin;
  let start = 0;
  while (start < commands.length && commands[start] !== begin) start++;
  let stop = start;
  while (stop < commands.length && commands[stop] !== end) stop++;
  return commands.slice(start, stop);
};
