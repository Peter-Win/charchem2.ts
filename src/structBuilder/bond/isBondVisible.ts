import { ChemBond } from "../../core/ChemBond";
import { is0 } from "../../math";

export const isBondVisible = (bond: ChemBond): boolean => !is0(bond.n);
