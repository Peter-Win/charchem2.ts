import { Point } from "../../math/Point";
import { ChemNode } from "../../core/ChemNode";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { PAgentCtx } from "./PAgentCtx";
import { getNodeInfo } from "../NodeInfo";
import { makeBridge } from "./brackets/processBrackets";

export class AgentCmdNode extends AgentCmd {
  prevBracket?: AgentCmdBrClose;

  constructor(public readonly node: ChemNode) {
    super();
  }

  override canPush(ctx: PAgentCtx): boolean {
    const { prevBracket } = this;
    if (prevBracket) {
      const br = prevBracket.end;
      if (br) {
        const n0 = br.nodes[0];
        const step = new Point();
        if (n0) {
          const ni0 = getNodeInfo(n0, ctx.nodesInfo);
          step.y = ni0.res.nodeFrame.org.y + ni0.res.center.y;
        }
        const isBothText = !!prevBracket.isRealText;
        makeBridge(ctx, br, true, isBothText);
      }
    }
    return false;
  }

  override onPrevious(cmd: AgentCmd): void {
    if (cmd instanceof AgentCmdBrClose) {
      this.prevBracket = cmd;
    }
  }
}
