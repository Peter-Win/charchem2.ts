import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { PAgentCtx } from "./PAgentCtx";
import { unwind } from "./unwind";

export class AgentCmdBridge extends AgentCmd {
  override onPrevious(cmd: AgentCmd): void {
    if (cmd instanceof AgentCmdBrClose) {
      // ]-
      this.srcCmd = cmd;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  override canPush(ctx: PAgentCtx): boolean {
    unwind(ctx, (cmd: AgentCmd) => cmd instanceof AgentCmdBridge);
    return true;
  }
}
