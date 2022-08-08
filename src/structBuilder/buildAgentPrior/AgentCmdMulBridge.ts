import { FigFrame } from "../../drawSys/figures/FigFrame";
import { ChemMul } from "../../core/ChemMul";
import { AgentCmdBridge } from "./AgentCmdBridge";
import { PAgentCtx } from "./PAgentCtx";
import { createCoeff } from "./createCoeff";
import { FigText } from "../../drawSys/figures/FigText";
import { Point } from "../../math/Point";

export class AgentCmdMulBridge extends AgentCmdBridge {
  constructor(public readonly mul: ChemMul) {
    super();
  }

  override postExec(ctx: PAgentCtx): void {
    const { mul } = this;
    const { props } = ctx;
    const [srcNode, dstNode] = mul.nodes;
    if (!srcNode || !dstNode) return;
    const bridgeFrame = new FigFrame();
    const mStyle = props.getStyleColored("multiplier", mul.color);
    const figMul = new FigText(props.mulChar, mStyle.font, mStyle.style);
    bridgeFrame.addFigure(figMul, true);
    if (mul.n.isSpecified()) {
      const figK = createCoeff(mul, props);
      figK.org.set(bridgeFrame.bounds.width, 0);
      bridgeFrame.addFigure(figK, true);
    }
    const { cluster, srcConn } = ctx.clusters.unite(
      ctx,
      { node: srcNode!, allBox: false },
      { node: dstNode!, allBox: false },
      new Point(bridgeFrame.bounds.width, 0)
    );
    bridgeFrame.org.set(srcConn.x, srcConn.yBase ?? srcConn.yMiddle);
    cluster.frame.addFigure(bridgeFrame, true);
  }
}
