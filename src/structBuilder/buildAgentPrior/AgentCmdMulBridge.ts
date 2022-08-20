import { FigFrame } from "../../drawSys/figures/FigFrame";
import { ChemMul } from "../../core/ChemMul";
import { AgentCmdBridge } from "./AgentCmdBridge";
import { PAgentCtx } from "./PAgentCtx";
import { createCoeff } from "./createCoeff";
import { FigText } from "../../drawSys/figures/FigText";
import { Point } from "../../math/Point";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { AgentCmdBrOpen } from "./AgentCmdBrOpen";

export class AgentCmdMulBridge extends AgentCmdBridge {
  constructor(public readonly mul: ChemMul) {
    super();
  }

  override postExec(ctx: PAgentCtx): void {
    const { mul } = this;
    const { props } = ctx;
    let [srcNode] = mul.nodes;
    const dstNode = mul.nodes[1];
    let isPrevBox = false;
    if (!srcNode && this.srcCmd instanceof AgentCmdBrClose) {
      // Такая ситуация возникает, если перед множителем закрывается скобка [K]*H
      [srcNode] = this.srcCmd.end.nodes;
      isPrevBox = true;
    }
    const isNextBox = this.dstCmd instanceof AgentCmdBrOpen;
    if (!srcNode || !dstNode) return;
    const bridgeFrame = new FigFrame();
    const { font: mFont, style: mStyle } = props.getStyleColored(
      "multiplier",
      mul.color
    );
    const mFields = props.lineWidth * 2;
    const figMul = new FigText(props.mulChar, mFont, mStyle);
    figMul.org.x = mFields;
    bridgeFrame.addFigure(figMul, true);
    if (mul.n.isSpecified()) {
      const figK = createCoeff(mul, props);
      figK.org.set(bridgeFrame.bounds.right + mFields, 0);
      bridgeFrame.addFigure(figK, true);
    }
    const { cluster, srcConn } = ctx.clusters.unite(
      ctx,
      { node: srcNode!, allBox: isPrevBox },
      { node: dstNode!, allBox: isNextBox },
      new Point(bridgeFrame.bounds.right, 0)
    );
    bridgeFrame.org.set(srcConn.x, srcConn.yBase ?? srcConn.yMiddle);
    cluster.frame.addFigure(bridgeFrame, true);
  }
}
