/**
 * Base class for all chemical objects
 * Supports information about the position of the object in the source description (usually after the preprocessor)
 * Created by PeterWin on 29.05.2022.
 */
import { Visitor } from "./Visitor";

export abstract class ChemObj {
  abstract walk<T extends Visitor>(visitor: T): void;

  walkExt<T extends Visitor>(visitor: T): T {
    this.walk(visitor);
    return visitor;
  }
}
