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

type FnCoordCvt = (x: number, y: number) => Point;
const mathArrWorldWidth = 40;
const mathArrWorldDx = 109;

const makeMathCoordCvt = (props: ChemImgProps): FnCoordCvt => {
  const { lineWidth } = props;
  // lineWidth -- mathArrWorldWidth
  // view Value -- world Value
  // view Value = world Value * lineWidth / mathArrowWorldWidth;
  const k = lineWidth / mathArrWorldWidth;
  return (x, y) => new Point(x * k, y * k);
};

const mathRightArrowCommands = (cvt: FnCoordCvt): PathSeg[] => [
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-47.3, 35.3),
    cp2: cvt(-84, 78),
    pt: cvt(-110, 128),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-16.7, 32),
    cp2: cvt(-27.7, 63.7),
    pt: cvt(-33, 95),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(0, 1.3),
    cp2: cvt(-0.2, 2.7),
    pt: cvt(-0.5, 4),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-0.3, 1.3),
    cp2: cvt(-0.5, 2.3),
    pt: cvt(-0.5, 3),
  },
  { cmd: "C", rel: true, cp1: cvt(0, 7.3), cp2: cvt(6.7, 11), pt: cvt(20, 11) },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(8, 0),
    cp2: cvt(13.2, -0.8),
    pt: cvt(15.5, -2.5),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(2.3, -1.7),
    cp2: cvt(4.2, -5.5),
    pt: cvt(5.5, -11.5),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(2, -13.3),
    cp2: cvt(5.7, -27),
    pt: cvt(11, -41),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(14.7, -44.7),
    cp2: cvt(39, -84.5),
    pt: cvt(73, -119.5),
  },
  { cmd: "S", rel: true, cp2: cvt(73.7, -60.2), pt: cvt(119, -75.5) },
  { cmd: "C", rel: true, cp1: cvt(6, -2), cp2: cvt(9, -5.7), pt: cvt(9, -11) },
  { cmd: "S", rel: true, cp2: cvt(-3, -9), pt: cvt(-9, -11) },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-45.3, -15.3),
    cp2: cvt(-85, -40.5),
    pt: cvt(-119, -75.5),
  },
  { cmd: "S", rel: true, cp2: cvt(-58.3, -74.8), pt: cvt(-73, -119.5) },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-4.7, -14),
    cp2: cvt(-8.3, -27.3),
    pt: cvt(-11, -40),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-1.3, -6.7),
    cp2: cvt(-3.2, -10.8),
    pt: cvt(-5.5, -12.5),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-2.3, -1.7),
    cp2: cvt(-7.5, -2.5),
    pt: cvt(-15.5, -2.5),
  },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(-14, 0),
    cp2: cvt(-21, 3.7),
    pt: cvt(-21, 11),
  },
  { cmd: "C", rel: true, cp1: cvt(0, 2), cp2: cvt(2, 10.3), pt: cvt(6, 25) },
  {
    cmd: "C",
    rel: true,
    cp1: cvt(20.7, 83.3),
    cp2: cvt(67, 151.7),
    pt: cvt(139, 205),
  },
];
const mathLeftArrowCommands = (cvt: FnCoordCvt): PathSeg[] =>
  mathRightArrowCommands((x, y) => cvt(-x, y));

type FnDrawSegs = (cvt: FnCoordCvt, width: number) => PathSeg[];

const mathArrow = (params: ParamsOpDraw, drawSegs: FnDrawSegs): FigDef => {
  const { props, commWidth, font, dstText, style } = params;
  const { lineWidth, line, thickWidth } = props;
  const minWidth = Math.max(line, font.getTextWidth(dstText));
  const arrDx = (mathArrWorldDx * lineWidth) / mathArrWorldWidth;
  const width = Math.max(commWidth + 2 * (thickWidth + arrDx), minWidth);
  const cvt = makeMathCoordCvt(props);
  const figOp = new FigPath(drawSegs(cvt, width), style);
  figOp.update();
  return { figOp, irc: figOp.bounds };
};
const drawMathRightSegs: FnDrawSegs = (cvt, width) => [
  { cmd: "M", pt: cvt(0, 0) },
  { cmd: "V", rel: true, y: cvt(0, mathArrWorldWidth).y },
  { cmd: "H", x: width - cvt(mathArrWorldDx, 0).x },
  ...mathRightArrowCommands(cvt),
  { cmd: "Z" },
];

const drawMathLeftSegs: FnDrawSegs = (cvt, width) => [
  { cmd: "M", pt: new Point(width, 0).plus(cvt(0, 241)) },
  { cmd: "H", x: cvt(110, 0).x },
  ...mathLeftArrowCommands(cvt),
  { cmd: "H", x: width },
  { cmd: "Z" },
];

const drawMathBiSegs: FnDrawSegs = (cvt, width) => {
  const p0 = new Point(width - cvt(mathArrWorldDx, 0).x, 0);
  return [
    { cmd: "M", pt: p0 },
    ...mathRightArrowCommands(cvt),
    { cmd: "Z" },
    { cmd: "H", x: cvt(110, 0).x },
    ...mathLeftArrowCommands(cvt),
    { cmd: "H", x: p0.x },
    { cmd: "Z" },
  ];
};

const drawMathBothSegs: FnDrawSegs = (cvt, width) => [
  { cmd: "M", pt: cvt(0, 0) },
  { cmd: "V", rel: true, y: cvt(0, mathArrWorldWidth).y },
  { cmd: "H", x: width - cvt(mathArrWorldDx, 0).x },
  ...mathRightArrowCommands(cvt),
  { cmd: "Z" },

  { cmd: "M", pt: new Point(width, 0).plus(cvt(0, 400)) },
  { cmd: "H", x: cvt(110, 0).x },
  ...mathLeftArrowCommands(cvt),
  { cmd: "H", x: width },
  { cmd: "Z" },
];

const mathRightArrow = (params: ParamsOpDraw): FigDef =>
  mathArrow(params, drawMathRightSegs);
const mathLeftArrow = (params: ParamsOpDraw): FigDef =>
  mathArrow(params, drawMathLeftSegs);
const mathBiArrow = (params: ParamsOpDraw): FigDef =>
  mathArrow(params, drawMathBiSegs);
const mathBothArrow = (params: ParamsOpDraw): FigDef =>
  mathArrow(params, drawMathBothSegs);

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

const opDict: Record<string, (params: ParamsOpDraw) => FigDef> = {
  "-->": mathRightArrow, // opLongArrow,
  "--|>": opLongArrow,
  "<==>": mathBothArrow, // opLongBothArrow,
  "<--": mathLeftArrow, // opLongLeftArrow,
  "<|--": opLongLeftArrow,
  "<-->": mathBiArrow, // opLongBiArrow,
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
