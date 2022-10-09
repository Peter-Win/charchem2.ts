import { ChemImgProps } from "../drawSys/ChemImgProps";
import { ChemAgent } from "../core/ChemAgent";
import { ChemExpr } from "../core/ChemExpr";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { buildExpression } from "./buildExpression";
import { buildAgentPrior } from "./buildAgentPrior/buildAgentPrior";

export const buildFrame = (
  expr: ChemExpr | ChemAgent,
  imgProps: ChemImgProps
): FigFrame =>
  expr instanceof ChemExpr
    ? buildExpression(expr, imgProps).frame
    : buildAgentPrior(expr, imgProps).agentFrame;
