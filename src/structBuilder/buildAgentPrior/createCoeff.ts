import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { ChemMul } from "../../core/ChemMul";
import { FigText } from "../../drawSys/figures/FigText";

export const createCoeff = (mul: ChemMul, props: ChemImgProps): FigText => {
  const kStyle = props.getStyleColored("multiK", mul.color);
  return new FigText(String(mul.n), kStyle.font, kStyle.style);
};
