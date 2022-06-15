import { ChemSubObj } from "./ChemSubObj";
import { Visitor } from "./Visitor";

export class ChemComment extends ChemSubObj {
  constructor(public readonly text: string) {
    super();
  }

  override walk(visitor: Visitor) {
    visitor.comment?.(this);
  }
}
