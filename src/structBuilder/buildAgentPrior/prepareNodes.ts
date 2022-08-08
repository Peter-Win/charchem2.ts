import { FigFrame } from "../../drawSys/figures/FigFrame";
import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import { buildNode } from "../buildNode";
import { PAgentCtx } from "./PAgentCtx";

export const prepareNodes = (ctx: PAgentCtx) => {
  const { agent, props } = ctx;
  agent.nodes.forEach((node) => {
    const res = buildNode(node, props) ?? {
      nodeFrame: new FigFrame(),
      rcNodeCore: new Rect(),
      center: new Point(),
    };
    const pos = node.pt.times(props.line);
    const { nodeFrame, center } = res;
    nodeFrame.org.iadd(pos);
    nodeFrame.org.isub(center);

    ctx.nodesInfo[node.index] = { node, res };
  });

  ctx.clusters.init(agent.nodes, ctx.nodesInfo);
};
