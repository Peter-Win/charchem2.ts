import { AgentCmd } from "./AgentCmd";
import { PAgentCtx } from "./PAgentCtx";

export const unwind = (ctx: PAgentCtx, canPop: (cmd: AgentCmd) => boolean) => {
  const { cmdStack } = ctx;
  for (;;) {
    const head = cmdStack.shift();
    if (!head) return;
    if (!canPop(head)) {
      cmdStack.unshift(head);
      return;
    }
    head.postExec(ctx);
  }
};
