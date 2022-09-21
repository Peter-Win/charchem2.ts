import { ChemBracketEnd } from "../../core/ChemBracket";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrOpen } from "./AgentCmdBrOpen";
import { PAgentCtx } from "./PAgentCtx";
import { unwind } from "./unwind";
import { Figure } from "../../drawSys/figures/Figure";
import { processBrackets } from "./brackets/processBrackets";

export class AgentCmdBrClose extends AgentCmd {
  figure?: Figure;

  isRealText?: boolean;

  constructor(public readonly end: ChemBracketEnd) {
    super();
  }

  override onPrevious(cmd: AgentCmd): void {
    // )]
    if (cmd instanceof AgentCmdBrClose) {
      this.srcCmd = cmd;
    }
  }

  override canPush(ctx: PAgentCtx): boolean {
    let isCanUnwindNext = true;
    unwind(ctx, (cmd) => {
      if (isCanUnwindNext && cmd instanceof AgentCmdBrOpen) {
        processBrackets(ctx, cmd, this);
        isCanUnwindNext = false;
        return true;
      }
      return isCanUnwindNext;
    });
    return false;
  }
}
