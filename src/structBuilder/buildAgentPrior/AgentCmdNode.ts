import { Point } from "../../math/Point";
import { CommonBracket } from "../../core/ChemBracket";
import { ChemNode } from "../../core/ChemNode";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { PAgentCtx } from "./PAgentCtx";
import { getNodeInfo } from "../NodeInfo";
import { makeBridge } from "./brackets/processBrackets";
import { ifDef } from "../../utils/ifDef";

export class AgentCmdNode extends AgentCmd {
  br?: CommonBracket;

  constructor(public readonly node: ChemNode) {
    super();
  }

  override canPush(ctx: PAgentCtx): boolean {
    // Если первая связь узла идет справа налево, то вносим узел в соответствующее множество
    const bonds = Array.from(this.node.bonds);
    ifDef(bonds[0]?.dir, (it) => {
      if (it.x < 0) ctx.rtlNodes.add(this.node.index);
    });
    if (this.br) {
      const n0 = this.br.nodes[0];
      const step = new Point();
      if (n0) {
        const ni0 = getNodeInfo(n0, ctx.nodesInfo);
        step.y = ni0.res.nodeFrame.org.y + ni0.res.center.y;
      }
      makeBridge(ctx, this.br, true, false);
    }
    return false;
  }

  override onPrevious(cmd: AgentCmd): void {
    if (cmd instanceof AgentCmdBrClose) {
      const { end } = cmd;
      this.br = end;
    }
  }
}
