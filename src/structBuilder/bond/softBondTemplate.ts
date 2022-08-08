import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { Point } from "../../math/Point";
import { ChemBond } from "../../core/ChemBond";

export const softBondTemplate = (
  bond: ChemBond,
  imgProps: ChemImgProps,
  src: Point
) => {
  const vDir = bond.dir ?? new Point(1, 0);
  const sign = vDir.x < 0 ? -1 : 1;
  const dir = new Point(vDir.x * imgProps.horizLine, vDir.y * imgProps.line);
  const field = new Point(sign * imgProps.nodeMargin, 0);
  const bondA = src.plus(field);
  const bondB = bondA.plus(dir);
  const dst = bondB.plus(field);
  return { src, dst, bondA, bondB, sign };
};
