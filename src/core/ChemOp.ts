import { ChemObj } from "./ChemObj";
import { Visitor } from "./Visitor";
import { ChemComment } from "./ChemComment";

// Операция в химическом выражении
// div - is divide expression by parts. =, -> are dividers. + is not divider

export class ChemOp extends ChemObj {
  constructor(
    public readonly srcText: string,
    public readonly dstText: string,
    public readonly div: boolean
  ) {
    super();
  }

  commentPre?: ChemComment;

  commentPost?: ChemComment;

  color?: string;

  override walk(visitor: Visitor) {
    visitor.operation?.(this);
  }
}
