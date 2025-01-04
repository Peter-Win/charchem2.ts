import { Int, Double } from "../types";
import { ChemSubObj } from "./ChemSubObj";
import { Visitor } from "./Visitor";

export class ChemAtom extends ChemSubObj {
  readonly stable: boolean;

  readonly epsilonMass: Double | undefined; // +/- Abridged standard atomic weight

  constructor(
    readonly n: Int, // Atomic number
    readonly id: string, // Symbol of a chemical element: H, He, Li, Be...
    readonly mass: Double, // Atomic mass in Daltons
    options?: {
      epsilonMass?: Double;
      stable?: boolean;
    }
  ) {
    super();
    const { stable, epsilonMass } = options ?? {};
    this.stable =
      stable === undefined ? Math.floor(this.mass) !== this.mass : stable;
    this.epsilonMass = epsilonMass;
  }

  walk<T extends Visitor>(visitor: T) {
    visitor.atom?.(this);
  }
}
