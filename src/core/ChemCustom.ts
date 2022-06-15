import { ChemSubObj } from "./ChemSubObj";
import { Visitor } from "./Visitor";

/**
 * Abstract component
 * For example: {R}-OH
 * Created by PeterWin on 29.04.2017.
 */
export class ChemCustom extends ChemSubObj {
  constructor(public readonly text: string) {
    super();
  }

  override walk(visitor: Visitor) {
    visitor.custom?.(this);
  }
}
