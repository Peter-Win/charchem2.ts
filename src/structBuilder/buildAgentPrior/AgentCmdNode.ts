import { Point } from "../../math/Point";
import { CommonBracket } from "../../core/ChemBracket";
import { ChemNode } from "../../core/ChemNode";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose, makeBridge } from "./AgentCmdBrClose";
import { PAgentCtx } from "./PAgentCtx";

export class AgentCmdNode extends AgentCmd {
  br?: CommonBracket;

  constructor(public readonly node: ChemNode) {
    super();
  }

  override canPush(ctx: PAgentCtx): boolean {
    if (this.br) makeBridge(ctx, this.br, new Point());
    return false;
  }

  override onPrevious(cmd: AgentCmd): void {
    if (cmd instanceof AgentCmdBrClose) {
      const { end } = cmd;
      this.br = end;
    }
  }
}
