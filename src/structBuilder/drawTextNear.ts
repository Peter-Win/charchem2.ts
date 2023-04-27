import { isClose } from "../math";
import { Rect } from "../math/Rect";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { ChemImgProps, TextProps } from "../drawSys/ChemImgProps";
import { drawText } from "./drawText";
import { CoeffPosOrAngle } from "../types/CoeffPos";
import { pointFromDeg } from "../math/Point";
import { Figure } from "../drawSys/figures/Figure";

export type NearTextType = "bracket" | undefined;

interface ParamsDrawTextNear {
  frame: FigFrame;
  rcCore: Rect;
  text: string;
  imgProps: ChemImgProps;
  style: TextProps;
  pos: CoeffPosOrAngle;
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

const makeRectExt = (
  rcCore: Rect,
  type: NearTextType,
  imgProps: ChemImgProps
): Rect => {
  const rcCoreExt = rcCore.clone();
  if (type === "bracket") {
    const sp = imgProps.lineWidth * 2;
    rcCoreExt.A.x -= sp;
    rcCoreExt.B.x += sp;
  }
  return rcCoreExt;
};

export const moveNearFigure = (
  fig: Figure,
  rcFig: Rect,
  pos: CoeffPosOrAngle,
  rcCore: Rect,
  imgProps: ChemImgProps,
  type: NearTextType
) => {
  const rcCoreExt = makeRectExt(rcCore, type, imgProps);

  /* eslint no-param-reassign: "off" */
  if (typeof pos === "number") {
    const { center } = rcCoreExt;
    const { b } = rcCoreExt.clip(
      center,
      center.plus(pointFromDeg(pos).times(rcCoreExt.width + rcCoreExt.height))
    );
    if (isClose(b.x, rcCoreExt.right)) {
      fig.org.x = b.x - rcFig.left;
    } else if (isClose(b.x, rcCoreExt.left)) {
      fig.org.x = b.x - rcFig.right;
    } else {
      fig.org.x = b.x - rcFig.left - rcFig.width / 2;
    }
    if (isClose(b.y, rcCoreExt.top)) {
      fig.org.y = b.y - rcFig.bottom;
    } else if (isClose(b.y, rcCoreExt.bottom)) {
      fig.org.y = b.y - rcFig.top;
    } else {
      fig.org.y = b.y - rcFig.top - rcFig.height / 2; // fontFace.ascent / 2;
    }
  } else {
    if (pos[0] === "R") {
      fig.org.x = rcCoreExt.right - rcFig.left;
    } else if (pos[0] === "L") {
      fig.org.x = rcCoreExt.left - rcFig.right;
    } else if (pos[0] === "C") {
      fig.org.x = rcCoreExt.cx - fig.bounds.width * 0.5;
    }
    if (pos[1] === "T") {
      fig.org.y =
        rcCoreExt.top +
        rcFig.height * (1 - getShiftCoeff(imgProps, "sup", type));
    } else if (pos[1] === "B") {
      fig.org.y =
        rcCoreExt.bottom + rcFig.height * getShiftCoeff(imgProps, "sub", type);
    } else if (pos[1] === "U") {
      fig.org.y = rcCoreExt.top - rcFig.bottom;
    } else if (pos[1] === "D") {
      fig.org.y = rcCoreExt.bottom - rcFig.top;
    }
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
  const rcCoreExt = makeRectExt(rcCore, type, imgProps);
  const fig = drawText(frame, text, style);
  const figFF = fig.font.getFontFace();
  if (typeof pos === "number") {
    const { center } = rcCoreExt;
    const { b } = rcCoreExt.clip(
      center,
      center.plus(pointFromDeg(pos).times(rcCoreExt.width + rcCoreExt.height))
    );
    if (isClose(b.x, rcCoreExt.right)) {
      fig.org.x = b.x;
    } else if (isClose(b.x, rcCoreExt.left)) {
      fig.org.x = b.x - fig.font.getTextWidth(text);
    } else {
      fig.org.x = b.x - fig.font.getTextWidth(text) / 2;
    }
    if (isClose(b.y, rcCoreExt.top)) {
      fig.org.y = b.y + figFF.descent;
    } else if (isClose(b.y, rcCoreExt.bottom)) {
      fig.org.y = b.y + figFF.ascent;
    } else {
      fig.org.y = b.y + figFF.ascent / 2;
    }
  } else {
    if (pos[0] === "R") {
      fig.org.x = rcCoreExt.right;
    } else if (pos[0] === "L") {
      fig.org.x = -fig.bounds.width;
    } else if (pos[0] === "C") {
      fig.org.x = rcCoreExt.cx - fig.bounds.width * 0.5;
    }
    if (pos[1] === "T") {
      fig.org.y =
        rcCoreExt.top +
        figFF.ascent * (1 - getShiftCoeff(imgProps, "sup", type));
    } else if (pos[1] === "B") {
      fig.org.y =
        rcCoreExt.bottom + figFF.ascent * getShiftCoeff(imgProps, "sub", type);
    } else if (pos[1] === "U") {
      fig.org.y = rcCoreExt.top + figFF.descent;
    } else if (pos[1] === "D") {
      fig.org.y = rcCoreExt.bottom + figFF.ascent;
    }
  }
  return fig;
};
