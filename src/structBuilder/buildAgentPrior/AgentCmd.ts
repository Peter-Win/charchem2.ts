import { PAgentCtx } from "./PAgentCtx";

export class AgentCmd {
  srcCmd?: AgentCmd;

  dstCmd?: AgentCmd;

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  canPush(ctx: PAgentCtx): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, class-methods-use-this
  postExec(ctx: PAgentCtx): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, class-methods-use-this
  onPrevious(cmd: AgentCmd): void {}
}
