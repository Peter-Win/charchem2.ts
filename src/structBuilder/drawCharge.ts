import { CoeffPos } from "../types/CoeffPos";
import { ChemStyleId } from "../drawSys/ChemStyleId";
import { ChemCharge } from "../core/ChemCharge";
import { ChemImgProps } from "../drawSys/ChemImgProps";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { Rect } from "../math/Rect";
import { drawTextNear, NearTextType } from "./drawTextNear";
import { FigEllipse } from "../drawSys/figures/FigEllipse";
import { Point } from "../math/Point";
import { getTextInternalRect } from "./getTextInternalRect";

interface ParamsDrawCharge {
  charge: ChemCharge;
  frame: FigFrame;
  rect: Rect;
  imgProps: ChemImgProps;
  color?: string;
  styleId?: ChemStyleId;
  type?: NearTextType;
}

export const drawCharge = ({
  charge,
  frame,
  rect,
  imgProps,
  color,
  styleId = "nodeCharge",
  type,
}: ParamsDrawCharge) => {
  const style = imgProps.getStyleColored(styleId, color);
  const pos: CoeffPos = charge.isLeft ? "LT" : "RT";
  const figTxt = drawTextNear({
    frame,
    rcCore: rect,
    text: charge.text,
    imgProps,
    style,
    pos,
    type,
  });
  frame.updateFigure(figTxt);
  if (charge.isRound) {
    // Плюс в круге обычно выглядит нормально. Но минус обычно находится ниже середины.
    // TODO: для улучшения внешнего вида стоит использовать не текст, а спец. фигуры
    // н.р. Cambria 229D
    const bounds = getTextInternalRect(figTxt);
    bounds.move(figTxt.org);
    const r = Math.max(bounds.width, figTxt.font.getFontFace().ascent) * 0.5;
    const figR = new FigEllipse(bounds.center, new Point(r, r), {
      stroke: style.style.fill,
    });
    frame.addFigure(figR, true);
  }
};
