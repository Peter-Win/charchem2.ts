import { ChemImgProps } from "../../drawSys/ChemImgProps";

export const getBondStyleWidth = (
  imgProps: ChemImgProps,
  styleDef?: string
): number => (styleDef === "I" ? imgProps.thickWidth : imgProps.lineWidth);
