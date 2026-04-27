import { ChemAgent } from "../core/ChemAgent";
import { ChemExpr } from "../core/ChemExpr";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { buildExpression } from "./buildExpression";
import { buildAgentPrior } from "./buildAgentPrior/buildAgentPrior";
import { StructBuilderCtx } from "./StructBuilderCtx";

export const buildFrame = (
  expr: ChemExpr | ChemAgent,
  ctx: StructBuilderCtx,
): FigFrame =>
  expr instanceof ChemExpr
    ? buildExpression(expr, ctx).frame
    : buildAgentPrior(expr, ctx).agentFrame;
