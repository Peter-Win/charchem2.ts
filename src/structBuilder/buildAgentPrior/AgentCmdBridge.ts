import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { PAgentCtx } from "./PAgentCtx";
import { unwind } from "./unwind";

export class AgentCmdBridge extends AgentCmd {
  override onPrevious(cmd: AgentCmd): void {
    // Здесь допущено неверное предположение о том что предыдущая команда всегда связана с текущей
    // Это предположение нарушается при использовании веток
    // Пример: N<|C(CH3)3>=O  Тут двойная связь не должна реагировать на предыдущую скобку
    // Проблема решена в AgentCmdSoftBond
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
