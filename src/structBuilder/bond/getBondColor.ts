import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { ChemBond } from "../../core/ChemBond";

export const getBondColor = (bond: ChemBond, imgProps: ChemImgProps): string =>
  bond.color ?? imgProps.stdStyle.style.fill;
