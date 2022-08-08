import { Double } from "../../types";
import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import { ChemNode } from "../../core/ChemNode";
import { Figure } from "../../drawSys/figures/Figure";
import { ParamsChemBackground } from "../../core/ChemBackground";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { PAgentCtx } from "./PAgentCtx";
import { getNodeInfo } from "../NodeInfo";
import { PathStyle } from "../../drawSys/AbstractSurface";
import { FigRect } from "../../drawSys/figures/FigRect";
import { FigEllipse } from "../../drawSys/figures/FigEllipse";
import { is0 } from "../../math";

export const applyPadding = (
  src: Rect,
  pads: Double[],
  scale: Double
): Rect => {
  if (pads.length === 1) {
    return src.clone().grow(pads[0]! * scale);
  }
  if (pads.length === 2) {
    return src.clone().grow(pads[1]! * scale, pads[0]! * scale);
  }
  if (pads.length === 3) {
    const top = pads[0]! * scale;
    const dx = pads[1]! * scale;
    const bot = pads[2]! * scale;
    return new Rect(
      src.left - dx,
      src.top - top,
      src.right + dx,
      src.bottom + bot
    );
  }
  const t = pads[0]! * scale;
  const r = pads[1]! * scale;
  const b = pads[2]! * scale;
  const l = pads[3]! * scale;
  return new Rect(src.left - l, src.top - t, src.right + r, src.bottom + b);
};

export const calcBgRect = (
  ctx: PAgentCtx,
  nodes: ChemNode[] = []
): Rect | undefined =>
  nodes.reduce((rc: Rect | undefined, node: ChemNode) => {
    const ni = getNodeInfo(node, ctx.nodesInfo);
    const rcNode = ni.res.nodeFrame.getRelativeBounds();
    return rc ? rc.unite(rcNode) : rcNode;
  }, undefined);

const createBgRect = (rc: Rect, style: PathStyle) => new FigRect(rc, style);

const createBgRound = (rc: Rect, style: PathStyle) => {
  const r = rc.center.minus(rc.A).length();
  return new FigEllipse(rc.center, new Point(r, r), style);
};

const createBgEllipse = (rc: Rect, style: PathStyle) => {
  const p0 = rc.center;
  const w = rc.width;
  const h = rc.height;
  if (is0(w - h)) return createBgRound(rc, style);
  const calcAB = (c: number, p: number) => {
    const d = p * p + 4 * c * c;
    const e = (-p + Math.sqrt(d)) / (2 * c);
    const a = c / e;
    const b = (c * Math.sqrt(1 - e * e)) / e;
    return { a, b };
  };
  if (w > h) {
    const { a, b } = calcAB(w / 2, h / 2);
    // const v = new Point(a, b);
    return new FigEllipse(p0, new Point(a, b), style);
  }
  const { a, b } = calcAB(h / 2, w / 2);
  // const v = new Point(b, a);
  return new FigEllipse(p0, new Point(b, a), style);
};

export const makeBackFigure = (
  ctx: PAgentCtx,
  params: ParamsChemBackground
): Figure => {
  const { nodes, isAll, padding, fill, stroke, strokeWidth, shape } = params;
  const { agentFrame, props } = ctx;
  let rect: Rect | undefined = isAll
    ? agentFrame.bounds.clone()
    : calcBgRect(ctx, nodes);
  if (!rect) {
    // Выгоднее использовать заглушку, чем потом контролировать пригодность полученных объектов.
    return new FigFrame();
  }
  if (padding) {
    rect = applyPadding(rect, padding, props.line);
  }

  const style: PathStyle = {};
  if (fill) style.fill = fill;
  if (stroke) style.stroke = stroke;
  if (strokeWidth) style.strokeWidth = props.lineWidth * strokeWidth;

  if (shape === "round") return createBgRound(rect, style);
  if (shape === "ellipse") return createBgEllipse(rect, style);
  return createBgRect(rect, style);
};

export const drawBackground = (ctx: PAgentCtx) => {
  const { backs } = ctx;
  if (backs.length === 0) return;
  const figs = backs.map((bg) => makeBackFigure(ctx, bg.params));
  figs.forEach((fig, i) => ctx.agentFrame.insertFigure(i, fig, true));
};
