import { ChemOp } from "../core/ChemOp";
import { ChemImgProps } from "../drawSys/ChemImgProps";
import { FigText } from "../drawSys/figures/FigText";
import { Point } from "../math/Point";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { getTextInternalRect } from "./getTextInternalRect";
import { Figure } from "../drawSys/figures/Figure";
import { Rect } from "../math/Rect";
import { ChemComment } from "../core/ChemComment";
import { ifDef } from "../utils/ifDef";
import { FigPath } from "../drawSys/figures/FigPath";
import { PathSeg } from "../drawSys/path";
import { LocalFont, PathStyle, TextStyle } from "../drawSys/AbstractSurface";
import { drawTextWithMarkup, ResultTextWithMarkup } from "./drawTextWithMarkup";

interface FigDef {
  figOp: Figure;
  irc: Rect;
}

interface ParamsOpDraw {
  srcText: string;
  dstText: string;
  props: ChemImgProps;
  font: LocalFont;
  style: TextStyle;
  commWidth: number;
}

interface ResultBuildOp {
  frame: FigFrame;
  center: Point;
}

export const buildOp = (op: ChemOp, props: ChemImgProps): ResultBuildOp => {
  const comms: [
    ResultTextWithMarkup | undefined,
    ResultTextWithMarkup | undefined
  ] = [
    ifDef(op.commentPre, (it) => buildOpComment(it, props, op.color)),
    ifDef(op.commentPost, (it) => buildOpComment(it, props, op.color)),
  ];
  const { srcText, dstText } = op;
  const commWidth = comms.reduce(
    (width, com) => Math.max(width, com ? com.fig.bounds.width : 0),
    0
  );
  const frame = new FigFrame();
  const style = props.getStyleColored("operation", op.color);
  const drawFn = opDict[srcText] ?? opTextFigure;
  const { figOp, irc } = drawFn({
    srcText,
    dstText,
    props,
    commWidth,
    ...style,
  });
  frame.addFigure(figOp, true);
  comms.forEach((com, i) =>
    ifDef(com, (it) => addOpComment(frame, irc, it, i === 0))
  );
  return { frame, center: irc.center };
};

const makeStrokeStyle = ({ props, style }: ParamsOpDraw): PathStyle => ({
  stroke: style.fill,
  strokeWidth: props.lineWidth,
});

const opTextFigure = ({ dstText, font, style }: ParamsOpDraw): FigDef => {
  const figOp = new FigText(dstText, font, style);
  const irc = getTextInternalRect(figOp);
  return { figOp, irc };
};

const opLongArrow = (params: ParamsOpDraw): FigDef => {
  const { props, style, font, commWidth, srcText, dstText } = params;
  const { arrowD, arrowL, line } = props;
  const isFilledArrow = srcText === "--|>";
  const minWidth = Math.max(line, font.getTextWidth(dstText));
  const width = Math.max(commWidth + 2 * props.opSpace, minWidth);
  const lineLen = width - arrowL;

  const segs: PathSeg[] = [
    { cmd: "M", pt: Point.zero },
    { cmd: "L", pt: new Point(isFilledArrow ? lineLen : width, 0) },
  ];
  const figLine = new FigPath(segs, makeStrokeStyle(params));
  figLine.update();

  const tri: PathSeg[] = [
    { cmd: "M", pt: new Point(lineLen, -arrowD) },
    { cmd: "L", pt: new Point(width, 0) },
    { cmd: "L", pt: new Point(lineLen, arrowD) },
  ];
  if (isFilledArrow) tri.push({ cmd: "Z" });
  const triStyle: PathStyle = isFilledArrow
    ? { fill: style.fill }
    : makeStrokeStyle(params);
  triStyle.join = "miter";
  const figArrow = new FigPath(tri, triStyle);
  figArrow.update();

  const figOp = new FigFrame();
  figOp.addFigure(figLine, true);
  figOp.addFigure(figArrow, true);
  return { figOp, irc: figOp.bounds };
};

const opLongLeftArrow = (params: ParamsOpDraw): FigDef => {
  const { props, style, font, commWidth, srcText, dstText } = params;
  const { arrowD, arrowL, line } = props;
  const isFilledArrow = srcText === "<|--";
  const minWidth = Math.max(line, font.getTextWidth(dstText));
  const width = Math.max(commWidth + 2 * props.opSpace, minWidth);

  const segs: PathSeg[] = [
    { cmd: "M", pt: new Point(width, 0) },
    { cmd: "L", pt: new Point(isFilledArrow ? arrowL : 0, 0) },
  ];
  const figLine = new FigPath(segs, makeStrokeStyle(params));
  figLine.update();

  const tri: PathSeg[] = [
    { cmd: "M", pt: new Point(arrowL, -arrowD) },
    { cmd: "L", pt: new Point(0, 0) },
    { cmd: "L", pt: new Point(arrowL, arrowD) },
  ];
  if (isFilledArrow) tri.push({ cmd: "Z" });
  const triStyle: PathStyle = isFilledArrow
    ? { fill: style.fill }
    : makeStrokeStyle(params);
  triStyle.join = "miter";
  const figArrow = new FigPath(tri, triStyle);
  figArrow.update();

  const figOp = new FigFrame();
  figOp.addFigure(figLine, true);
  figOp.addFigure(figArrow, true);
  return { figOp, irc: figOp.bounds };
};

// <-->
const opLongBiArrow = (params: ParamsOpDraw): FigDef => {
  const { props, style, font, commWidth, srcText, dstText } = params;
  const { arrowD, arrowL, line } = props;
  const isFilledArrow = srcText === "<|--|>";
  const minWidth = Math.max(line, font.getTextWidth(dstText));
  const width = Math.max(commWidth + 2 * props.opSpace, minWidth);
  const lineLen = width - arrowL;

  const segs: PathSeg[] = [
    { cmd: "M", pt: new Point(isFilledArrow ? lineLen : width, 0) },
    { cmd: "L", pt: new Point(isFilledArrow ? arrowL : 0, 0) },
  ];
  const figLine = new FigPath(segs, makeStrokeStyle(params));
  figLine.update();

  const triLeft: PathSeg[] = [
    { cmd: "M", pt: new Point(arrowL, -arrowD) },
    { cmd: "L", pt: new Point(0, 0) },
    { cmd: "L", pt: new Point(arrowL, arrowD) },
  ];
  if (isFilledArrow) triLeft.push({ cmd: "Z" });
  const triStyle: PathStyle = isFilledArrow
    ? { fill: style.fill }
    : makeStrokeStyle(params);
  triStyle.join = "miter";
  const figArrowLeft = new FigPath(triLeft, triStyle);
  figArrowLeft.update();

  const triRight: PathSeg[] = [
    { cmd: "M", pt: new Point(lineLen, -arrowD) },
    { cmd: "L", pt: new Point(width, 0) },
    { cmd: "L", pt: new Point(lineLen, arrowD) },
  ];
  if (isFilledArrow) triRight.push({ cmd: "Z" });
  const figArrowRight = new FigPath(triRight, triStyle);
  figArrowRight.update();

  const figOp = new FigFrame();
  figOp.addFigure(figArrowLeft, true);
  figOp.addFigure(figLine, true);
  figOp.addFigure(figArrowRight, true);
  return { figOp, irc: figOp.bounds };
};

const opLongBothArrow = (params: ParamsOpDraw): FigDef => {
  const { props, commWidth } = params;
  const { lineWidth, lineSpace2x, arrowD, arrowL, opSpace } = props;
  const dy = (lineSpace2x + lineWidth) / 2;
  const width = commWidth + 2 * opSpace;
  const segs: PathSeg[] = [
    { cmd: "M", pt: new Point(0, -dy) },
    { cmd: "H", x: width - lineWidth },
    { cmd: "L", rel: true, pt: new Point(-arrowL, -arrowD) },
    { cmd: "M", pt: new Point(width, dy) },
    { cmd: "H", x: lineWidth },
    { cmd: "L", rel: true, pt: new Point(arrowL, arrowD) },
  ];
  const figOp = new FigPath(segs, {
    ...makeStrokeStyle(params),
    join: "miter",
  });
  figOp.update();
  return { figOp, irc: figOp.bounds };
};

const opDict: Record<string, (params: ParamsOpDraw) => FigDef> = {
  "-->": opLongArrow,
  "--|>": opLongArrow,
  "<==>": opLongBothArrow,
  "<--": opLongLeftArrow,
  "<|--": opLongLeftArrow,
  "<-->": opLongBiArrow,
};

const addOpComment = (
  frame: FigFrame,
  opRect: Rect,
  comm: ResultTextWithMarkup,
  isTop: boolean
): void => {
  const { fig, irc } = comm;
  const { bounds } = fig;
  fig.org.set(
    irc.left + opRect.width / 2 - irc.width / 2,
    isTop ? -(bounds.bottom - irc.bottom) + opRect.top : opRect.bottom - irc.top
  );
  frame.addFigure(fig, true);
};

const buildOpComment = (
  comm: ChemComment,
  props: ChemImgProps,
  color: string | undefined
): ResultTextWithMarkup => {
  const tp = props.getStyleColored("opComment", color);
  return drawTextWithMarkup(comm.text, props, tp);
};
