import { Figure } from "../../drawSys/figures/Figure";
import { ChemBracketBegin } from "../../core/ChemBracket";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { AgentCmdBridge } from "./AgentCmdBridge";

export class AgentCmdBrOpen extends AgentCmd {
  isBridge: boolean = false;

  withBracket: boolean = false;

  figure?: Figure;

  constructor(public readonly begin: ChemBracketBegin) {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  override canPush() {
    return true;
  }

  override onPrevious(cmd: AgentCmd): void {
    // Если перед началом скобки стоит мост или любая скобка,
    // То предыдущая команда должна на выходе стыковаться с текущей на входе
    // -(, [(, ](
    if (
      cmd instanceof AgentCmdBridge ||
      cmd instanceof AgentCmdBrOpen
      // cmd instanceof AgentCmdBrClose
    ) {
      // eslint-disable-next-line no-param-reassign
      cmd.dstCmd = this;
      this.srcCmd = cmd;
    } else if (cmd instanceof AgentCmdBrClose) {
      // eslint-disable-next-line prefer-destructuring
      this.begin.nodes[0] = cmd.end.nodes[0];
      this.isBridge = true;
      this.withBracket = true;
    } else {
      const [n1, n2] = this.begin.nodes;
      if (n1?.subChain !== n2?.subChain) {
        this.isBridge = true;
      }
    }
  }
}
