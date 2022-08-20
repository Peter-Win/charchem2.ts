import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import {
  ChemBracketEnd,
  CommonBracket,
  getBracketsContent,
} from "../../core/ChemBracket";
import { ChemNode } from "../../core/ChemNode";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrOpen } from "./AgentCmdBrOpen";
import { PAgentCtx } from "./PAgentCtx";
import { unwind } from "./unwind";
import { FigText } from "../../drawSys/figures/FigText";
import { ChemObj } from "../../core/ChemObj";
import { getNodeCenterPos, getNodeInfo, NodeInfo } from "../NodeInfo";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { isTextBracketsCached } from "../../core/isTextBrackets";
import { Figure } from "../../drawSys/figures/Figure";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { drawRubberFigure } from "../../drawSys/figures/rubber/drawRubberFigure";
import { getRubberBracket } from "../../drawSys/figures/rubber/getRubberBracket";
import { PathStyle } from "../../drawSys/AbstractSurface";
import { ChemK } from "../../core/ChemK";
import { drawTextNear } from "../drawTextNear";
import { getTextInternalRect } from "../getTextInternalRect";
import { ChemCharge } from "../../core/ChemCharge";
import { drawCharge } from "../drawCharge";
import { AgentCmdMul } from "./AgentCmdMul";
import { applyPadding } from "../applyPadding";
import { ifDef } from "../../utils/ifDef";
import { getFontHeight } from "../../drawSys/utils/fontFaceProps";
import { isLeftCoeff } from "../../types/CoeffPos";

interface ResBracket {
  figure: Figure;
  y: number;
  rect: Rect;
}

const bracketCoeffs = (
  frame: FigFrame,
  rect: Rect,
  props: ChemImgProps,
  color?: string,
  n?: ChemK,
  charge?: ChemCharge
) => {
  if (charge) {
    drawCharge({ charge, frame, rect, imgProps: props, color });
  }
  if (n && n.isSpecified()) {
    drawTextNear(
      frame,
      rect,
      String(n),
      props,
      props.getStyleColored("itemCount", color),
      n.pos ?? "RB"
    );
  }
  frame.update();
};

const rubberBracket = (
  isOpen: boolean,
  bracket: CommonBracket,
  props: ChemImgProps,
  contentRect: Rect,
  n?: ChemK,
  charge?: ChemCharge
): ResBracket => {
  const rubberFig = getRubberBracket(isOpen, bracket.text);
  const desiredRect = new Rect(0, 0, props.bracketWidth, contentRect.height);
  const style: PathStyle = { fill: bracket.color ?? props.stdStyle.style.fill };
  const frame = new FigFrame();
  frame.addFigure(drawRubberFigure(rubberFig, desiredRect, style, props), true);
  const rect = frame.bounds.clone();
  bracketCoeffs(frame, rect, props, bracket.color, n, charge);
  return {
    figure: frame,
    y: contentRect.top,
    rect,
  };
};

const textBracket = (
  bracket: CommonBracket,
  props: ChemImgProps,
  contentRect: Rect,
  k?: ChemK,
  charge?: ChemCharge
): ResBracket => {
  const style = props.getStyleColored("bracket", bracket.color);
  const frame = new FigFrame();
  const figText = new FigText(bracket.text, style.font, style.style);
  frame.addFigure(figText, true);
  const { top } = frame.bounds;
  const rect = getTextInternalRect(figText);
  bracketCoeffs(frame, rect, props, bracket.color, k, charge);
  return {
    figure: frame,
    y: contentRect.top - top,
    rect,
  };
};

interface ParamsDrawBracket {
  bracket: CommonBracket;
  props: ChemImgProps;
  isText: boolean;
  isOpen: boolean;
  contentRect: Rect;
  nodeInfo: NodeInfo;
  n?: ChemK;
  charge?: ChemCharge;
}

const drawBracket = ({
  bracket,
  contentRect,
  isOpen,
  isText,
  props,
  n,
  charge,
}: ParamsDrawBracket): Figure => {
  const { figure, y, rect } = isText
    ? textBracket(bracket, props, contentRect, n, charge)
    : rubberBracket(isOpen, bracket, props, contentRect, n, charge);
  const x = isOpen ? contentRect.left - rect.width : contentRect.right;
  figure.org.set(x, y);
  return figure;
};

export const makeBridge = (
  ctx: PAgentCtx,
  bracket: CommonBracket,
  step?: Point
) => {
  const [node0, node1] = bracket.nodes;
  if (node0 && node1) {
    const src = { node: node0, allBox: true };
    const dst = { node: node1, allBox: true };
    let realStep: Point;
    if (step) {
      realStep = step;
    } else {
      realStep = new Point(ctx.props.nodeMargin, 0);
      const { cluster: c0 } = ctx.clusters.findByNode(node0);
      const { cluster: c1 } = ctx.clusters.findByNode(node1);
      const b0 = c0.contentRect ?? c0.frame.bounds;
      const b1 = c1.contentRect ?? c1.frame.bounds;
      realStep.y = b0.top - b1.top + (b0.height - b1.height) / 2;
    }
    ctx.clusters.unite(ctx, src, dst, realStep, true);
  }
};

const calcBracketRect = (
  content: ChemObj[],
  nodesInfo: NodeInfo[]
): Rect | undefined =>
  content.reduce((rect, cmd) => {
    if (cmd instanceof ChemNode) {
      const nodeInfo = getNodeInfo(cmd, nodesInfo);
      const rcRel: Rect = nodeInfo.res.nodeFrame.getRelativeBounds();
      if (!rect) return rcRel;
      rect.unite(rcRel);
      return rect;
    }
    return rect;
  }, undefined as Rect | undefined);

const processBrackets = (
  ctx: PAgentCtx,
  cmdOpen: AgentCmdBrOpen,
  cmdClose: AgentCmdBrClose
) => {
  const { begin } = cmdOpen;
  const { end } = cmdClose;
  const { nodesInfo, agent, clusters, props } = ctx;
  const { useTextBrackets, line, lineWidth } = props;
  const beginNode = begin.nodes[1];
  const endNode = end.nodeIn;
  if (!beginNode || !endNode) return;
  const { cluster } = clusters.findByNode(beginNode);
  const beginNi = getNodeInfo(beginNode, nodesInfo);
  const endNi = getNodeInfo(endNode, nodesInfo);
  const isText0: boolean = useTextBrackets
    ? isTextBracketsCached(begin, agent.commands)
    : false;
  const content = getBracketsContent(begin, agent.commands);
  let contentRect0 = calcBracketRect(content, nodesInfo);
  if (
    (!contentRect0 || contentRect0.isEmpty()) &&
    content.length === 1 &&
    content[0] instanceof ChemNode
  ) {
    // Пустые скобки при наличии автоузла внутри. Example: /()'n'\
    const { font } = props.getStyle("atom");
    const ff = font.getFontFace();
    const h = getFontHeight(ff) / 2;
    const p = getNodeCenterPos(getNodeInfo(content[0], nodesInfo));
    contentRect0 = new Rect(
      new Point(p.x - lineWidth, p.y - h),
      new Point(p.x + lineWidth, p.y + h)
    );
  }
  const contentRect1 = contentRect0;
  if (!contentRect1) return;

  const contentRect =
    ifDef(begin.padding, (p) => applyPadding(contentRect1, p, line)) ??
    contentRect1;
  const isText = isText0 && contentRect.height === contentRect1.height;

  const xPad = isText ? 0 : lineWidth;
  if (
    cmdOpen.dstCmd instanceof AgentCmdBrOpen ||
    cmdOpen.dstCmd instanceof AgentCmdMul
  ) {
    if (cmdOpen.dstCmd.figure) {
      const rc = cmdOpen.dstCmd.figure.getRelativeBounds();
      contentRect.updatePoint(new Point(rc.left - xPad, rc.center.y));
    }
  }
  if (cmdOpen.srcCmd instanceof AgentCmdBrClose) {
    if (cmdOpen.srcCmd.figure) {
      const rc = cmdOpen.srcCmd.figure.getRelativeBounds();
      contentRect.updatePoint(new Point(rc.left, rc.center.y));
    }
  }
  if (cmdClose.srcCmd instanceof AgentCmdBrClose) {
    if (cmdClose.srcCmd.figure) {
      const rc = cmdClose.srcCmd.figure.getRelativeBounds();
      contentRect.updatePoint(new Point(rc.right + xPad, rc.center.y));
    }
  }

  // TODO: отладочный вывод рамки
  // const fr = new FigRect(contentRect, {stroke: "red", strokeWidth: 0.5});
  // cluster.frame.addFigure(fr);

  const { charge, n } = end;
  const ch = (open: boolean): ChemCharge | undefined =>
    open === charge?.isLeft ? charge : undefined;
  const coeff = (open: boolean): ChemK | undefined =>
    open === isLeftCoeff(n.pos) ? n : undefined;
  const figOpen = drawBracket({
    isOpen: true,
    bracket: begin,
    isText,
    props,
    contentRect,
    nodeInfo: beginNi,
    n: coeff(true),
    charge: ch(true),
  });
  const figClose = drawBracket({
    isOpen: false,
    bracket: end,
    isText,
    props,
    contentRect,
    nodeInfo: endNi,
    n: coeff(false),
    charge: ch(false),
  });
  // cluster.frame.addFigure(new FigRect(contentRect, {stroke: "magenta"}));
  cluster.frame.addFigure(figOpen, true);
  cluster.frame.addFigure(figClose, true);
  // eslint-disable-next-line no-param-reassign
  cmdOpen.figure = figOpen;
  // eslint-disable-next-line no-param-reassign
  cmdClose.figure = figClose;
  cluster.contentRect = contentRect;

  if (cmdOpen.isBridge) {
    makeBridge(ctx, cmdOpen.begin);
  }
};

export class AgentCmdBrClose extends AgentCmd {
  figure?: Figure;

  constructor(public readonly end: ChemBracketEnd) {
    super();
  }

  override onPrevious(cmd: AgentCmd): void {
    // )]
    if (cmd instanceof AgentCmdBrClose) {
      this.srcCmd = cmd;
    }
  }

  override canPush(ctx: PAgentCtx): boolean {
    let isCanUnwindNext = true;
    unwind(ctx, (cmd) => {
      if (isCanUnwindNext && cmd instanceof AgentCmdBrOpen) {
        processBrackets(ctx, cmd, this);
        isCanUnwindNext = false;
        return true;
      }
      return isCanUnwindNext;
    });
    return false;
  }
}
