import { Rect } from "../math/Rect";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { ChemImgProps, TextProps } from "../drawSys/ChemImgProps";
import { drawText } from "./drawText";
import { CoeffPos } from "../types/CoeffPos";

export type NearTextType = "bracket" | undefined;

interface ParamsDrawTextNear {
  frame: FigFrame;
  rcCore: Rect;
  text: string;
  imgProps: ChemImgProps;
  style: TextProps;
  pos: CoeffPos;
  type?: NearTextType;
}

const getShiftCoeff = (
  imgProps: ChemImgProps,
  pos: "sup" | "sub",
  type: NearTextType
): number => {
  switch (type) {
    case "bracket":
      return pos === "sup" ? imgProps.bracketSupKY : imgProps.bracketSubKY;
    default:
      return pos === "sup" ? imgProps.supKY : imgProps.subKY;
  }
};

export const drawTextNear = ({
  frame,
  rcCore,
  text,
  imgProps,
  style,
  pos,
  type,
}: ParamsDrawTextNear) => {
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
    fig.org.y =
      rcCore.top + figFF.ascent * (1 - getShiftCoeff(imgProps, "sup", type));
  } else if (pos[1] === "B") {
    fig.org.y =
      rcCore.bottom + figFF.ascent * getShiftCoeff(imgProps, "sub", type);
  } else if (pos[1] === "U") {
    fig.org.y = rcCore.top + figFF.descent;
  }
  return fig;
};
