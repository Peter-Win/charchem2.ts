import { ChemSubObj } from "./ChemSubObj";
import { Visitor } from "./Visitor";

export class ChemComma extends ChemSubObj {
  override walk(visitor: Visitor) {
    visitor.comma?.(this);
  }
}

export const instChemComma: ChemComma = new ChemComma();
