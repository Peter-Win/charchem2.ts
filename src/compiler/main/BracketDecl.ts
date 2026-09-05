import { Int } from "../../types";
import { ChemBracketBegin } from "../../core/ChemBracket";
import { StackItem } from "./StackItem";

export class BracketDecl extends StackItem {
  constructor(
    pos: Int,
    public readonly begin: ChemBracketBegin,
  ) {
    super(pos);
  }

  // eslint-disable-next-line class-methods-use-this
  override msgInvalidClose(): string {
    return "It is necessary to close the bracket";
  }
}
