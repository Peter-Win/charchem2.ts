import { Rect } from "../math/Rect";
import { FigText } from "../drawSys/figures/FigText";

export const getTextInternalRect = (figText: FigText): Rect => {
  const rc = figText.bounds.clone();
  rc.A.y = -figText.font.getFontFace().ascent;
  rc.B.y = 0;
  return rc;
};
