import { FigFrame } from "../drawSys/figures/FigFrame";
import { TextProps } from "../drawSys/ChemImgProps";
import { FigText } from "../drawSys/figures/FigText";

export const drawText = (
  frame: FigFrame,
  text: string,
  style: TextProps
): FigText => {
  const fig = new FigText(text, style.font, style.style);
  frame.addFigure(fig);
  return fig;
};
