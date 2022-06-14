import { Int, Double } from "../types";
import { ChemSubObj } from "./ChemSubObj";
import { Visitor } from "./Visitor";

export class ChemAtom extends ChemSubObj {
  readonly stable: boolean;

  constructor(
    readonly n: Int, // Atomic number
    readonly id: string, // Symbol of a chemical element: H, He, Li, Be...
    readonly mass: Double, // Atomic mass in Daltons
    stable?: boolean
  ) {
    super();
    this.stable =
      stable === undefined ? Math.floor(this.mass) !== this.mass : stable;
  }

  walk<T extends Visitor>(visitor: T) {
    if (visitor.atom) visitor.atom(this);
  }
}
