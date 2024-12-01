/**
 * Алгоритм построения агента, использующий приоритет команд
 *
 */

import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { ChemAgent } from "../../core/ChemAgent";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { PAgentCtx } from "./PAgentCtx";
import { prepareNodes } from "./prepareNodes";
import { processCommands } from "./processCommands";
import { drawAllBonds } from "./drawAllBonds";
import { Point } from "../../math/Point";
import { findAgentCenter } from "./findAgentCenter";
import { FigText } from "../../drawSys/figures/FigText";
import { getTextInternalRect } from "../getTextInternalRect";
import { drawBackground } from "./drawBackground";

export interface ResultBuildAgent {
  agentFrame: FigFrame;
  center: Point;
  ctx: PAgentCtx;
}

export const buildAgentPrior = (
  agent: ChemAgent,
  imgProps: ChemImgProps
): ResultBuildAgent => {
  const ctx = new PAgentCtx(agent, imgProps);
  const { agentFrame } = ctx;

  prepareNodes(ctx);
  processCommands(ctx);
  ctx.clusters.uniteRest(ctx);
  drawAllBonds(ctx);

  const cluster = ctx.clusters.clusters.shift();
  if (cluster) {
    cluster.frame.figures.forEach((fig) => agentFrame.addFigure(fig));
    agentFrame.update();
  }
  drawBackground(ctx);
  const center = findAgentCenter(ctx);

  if (agent.n.isSpecified()) {
    const kStyle = imgProps.getStyleColored("agentK", agent.n.color);
    const figK = new FigText(agent.n.toString(), kStyle.font, kStyle.style);
    const irc = getTextInternalRect(figK);
    figK.org.x =
      agentFrame.bounds.left - figK.bounds.width - imgProps.agentKSpace;
    figK.org.y = center.y - irc.center.y;
    agentFrame.addFigure(figK, true);
  }

  return { agentFrame, ctx, center };
};
