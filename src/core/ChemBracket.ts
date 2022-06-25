/* eslint-disable max-classes-per-file */
import { ChemBond } from "./ChemBond";
import { ChemObj } from "./ChemObj";
import { Visitor } from "./Visitor";
import { ChemChargeOwner } from "./ChemChargeOwner";
import { ChemCharge } from "./ChemCharge";
import { ChemNode } from "./ChemNode";
import { ChemK } from "./ChemK";

// Pairs of open and closed brackets
export const bracketPairs: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{[": "]}",
};

export class ChemBracketBegin extends ChemObj {
  constructor(public readonly text: string) {
    super();
  }

  end?: ChemBracketEnd;

  isText?: boolean;

  bond?: ChemBond;

  color?: string;

  override walk(visitor: Visitor) {
    visitor.bracketBegin?.(this);
  }
}

export class ChemBracketEnd extends ChemObj implements ChemChargeOwner {
  constructor(
    public readonly text: string,
    public readonly begin: ChemBracketBegin,
    public readonly nodeIn: ChemNode
  ) {
    super();
  }

  charge?: ChemCharge = undefined;

  n: ChemK = new ChemK(1);

  bond?: ChemBond;

  // this.nodes = [null, null]
  // this.bond = null
  override walk(visitor: Visitor) {
    visitor.bracketEnd?.(this);
  }
}
