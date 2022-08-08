import { ChemOp } from "../core/ChemOp";
import { ChemImgProps } from "../drawSys/ChemImgProps";
import { FigText } from "../drawSys/figures/FigText";
import { Point } from "../math/Point";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { getTextInternalRect } from "./getTextInternalRect";

interface ResultBuildOp {
  frame: FigFrame;
  center: Point;
}
export const buildOp = (op: ChemOp, props: ChemImgProps): ResultBuildOp => {
  // TODO: Пока просто заглушка
  const frame = new FigFrame();
  const style = props.getStyleColored("operation", op.color);
  const figOp = new FigText(op.dstText, style.font, style.style);
  const irc = getTextInternalRect(figOp);
  frame.addFigure(figOp, true);
  return { frame, center: irc.center };
};
