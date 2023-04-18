import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { Figure } from "../../drawSys/figures/Figure";
import { FigText } from "../../drawSys/figures/FigText";
import { LocalFont, TextStyle } from "../../drawSys/AbstractSurface";
import { FigEllipse } from "../../drawSys/figures/FigEllipse";
import { Point } from "../../math/Point";
import { getFontHeight } from "../../drawSys/utils/fontFaceProps";

export const drawMul = (
  props: ChemImgProps,
  mFont: LocalFont,
  mStyle: TextStyle
): Figure => {
  const { mulRadius } = props;
  if (mulRadius) {
    const ff = mFont.getFontFace();
    const r = getFontHeight(ff) * mulRadius;
    return new FigEllipse(new Point(r, -ff.capHeight * 0.5), new Point(r, r), {
      fill: mStyle.fill,
    });
  }
  return new FigText(props.mulChar, mFont, mStyle);
};
