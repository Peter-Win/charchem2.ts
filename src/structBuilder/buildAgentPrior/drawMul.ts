import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { Figure } from "../../drawSys/figures/Figure";
import { FigText } from "../../drawSys/figures/FigText";
import { LocalFont, TextStyle } from "../../drawSys/AbstractSurface";
import { FigEllipse } from "../../drawSys/figures/FigEllipse";
import { Point } from "../../math/Point";

export const drawMul = (
  props: ChemImgProps,
  mFont: LocalFont,
  mStyle: TextStyle
): Figure => {
  const { mulRadius } = props;
  if (mulRadius) {
    const r = props.line * mulRadius;
    const ff = mFont.getFontFace();
    return new FigEllipse(new Point(r, -ff.capHeight * 0.5), new Point(r, r), {
      fill: mStyle.fill,
    });
  }
  return new FigText(props.mulChar, mFont, mStyle);
};
