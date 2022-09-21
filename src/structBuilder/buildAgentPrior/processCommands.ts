import { ChemBackground } from "../../core/ChemBackground";
import { AgentCmd } from "./AgentCmd";
import { createAgentCmd } from "./createAgentCmd";
import { PAgentCtx } from "./PAgentCtx";
import { unwind } from "./unwind";

export const processCommands = (ctx: PAgentCtx) => {
  let previousCmd: AgentCmd;
  ctx.agent.commands.forEach((obj) => {
    if (obj instanceof ChemBackground) {
      ctx.backs.push(obj);
      return;
    }
    const cmd = createAgentCmd(obj, ctx.agent);
    if (previousCmd) cmd.onPrevious(previousCmd, ctx);
    if (cmd.canPush(ctx)) {
      ctx.cmdStack.unshift(cmd);
    }
    previousCmd = cmd;
  });
  unwind(ctx, () => true);
};
