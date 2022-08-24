import { Rect } from "../math/Rect";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { ChemImgProps, TextProps } from "../drawSys/ChemImgProps";
import { drawText } from "./drawText";
import { CoeffPos } from "../types/CoeffPos";

export const drawTextNear = (
  frame: FigFrame,
  rcCore: Rect,
  text: string,
  imgProps: ChemImgProps,
  style: TextProps,
  pos: CoeffPos
) => {
  const fig = drawText(frame, text, style);
  const figFF = fig.font.getFontFace();
  if (pos[0] === "R") {
    fig.org.x = rcCore.right;
  } else if (pos[0] === "L") {
    fig.org.x = -fig.bounds.width;
  } else if (pos[0] === "C") {
    fig.org.x = rcCore.cx - fig.bounds.width * 0.5;
  }
  if (pos[1] === "T") {
    fig.org.y = rcCore.top + figFF.ascent * (1 - imgProps.supKY);
  } else if (pos[1] === "B") {
    fig.org.y = rcCore.bottom + figFF.ascent * imgProps.subKY;
  } else if (pos[1] === "U") {
    fig.org.y = rcCore.top + figFF.descent;
  }
  return fig;
};
