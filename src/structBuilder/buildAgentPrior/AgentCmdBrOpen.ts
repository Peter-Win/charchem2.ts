import { Figure } from "../../drawSys/figures/Figure";
import { ChemBracketBegin } from "../../core/ChemBracket";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { AgentCmdBridge } from "./AgentCmdBridge";
import { ifDef } from "../../utils/ifDef";
import { PAgentCtx } from "./PAgentCtx";
import { ChemNode } from "../../core/ChemNode";
import { AgentCmdNode } from "./AgentCmdNode";

export class AgentCmdBrOpen extends AgentCmd {
  isBridge: boolean = false;

  prevBracket?: AgentCmdBrClose;

  prevText?: boolean;

  figure?: Figure;

  constructor(public readonly begin: ChemBracketBegin) {
    super();
  }

  checkRtl(ctx: PAgentCtx, rtlNode?: ChemNode) {
    ifDef(rtlNode, (it) => {
      ctx.rtlNodes.add(it.index);
      ifDef(this.begin?.end?.nodes[0], (endNode) =>
        ctx.rtlNodes.add(endNode.index),
      );
    });
  }

  override canPush(ctx: PAgentCtx) {
    this.checkRtl(
      ctx,
      ifDef(this.begin.bond, (bond) =>
        ifDef(bond.dir, (dir) => (dir.x < 0 ? bond.nodes[1] : undefined)),
      ),
    );
    return true;
  }

  override onPrevious(cmd: AgentCmd, ctx: PAgentCtx): void {
    // Если перед началом скобки стоит мост или любая скобка,
    // То предыдущая команда должна на выходе стыковаться с текущей на входе
    // -(, [(
    if (cmd instanceof AgentCmdBridge || cmd instanceof AgentCmdBrOpen) {
      cmd.dstCmd = this;
      this.srcCmd = cmd;
    } else if (cmd instanceof AgentCmdBrClose) {
      const [beginNode] = this.begin.nodes;
      if (
        beginNode &&
        (cmd.end.nodes[0] === beginNode || cmd.end.begin.nodes[0] === beginNode)
      ) {
        // Это случай, когда скобки являются соседями. Т.е (A)(B) or (=A)(=B)
        if (ctx.rtlNodes.has(beginNode.index)) {
          this.checkRtl(ctx, beginNode);
        }
        this.prevBracket = cmd;
        this.isBridge = true;
      } else {
        // здесь скобки хотя и рядом, но находятся в разных ветках A<(B)>(C)
        this.isBridge = true;
      }
    } else {
      if (cmd instanceof AgentCmdNode) {
        // todo: тут тоже надо проверять узел, чтобы он не оказался в ветке
        this.prevText = true;
        // Если у узла одна связь, то проверить направление
        const { node } = cmd;
        if (node.bonds.size === 1) {
          const nodeBond = Array.from(node.bonds)[0]!;
          ifDef(nodeBond.dir, (dir) => {
            // если просто < 0, то случаются ошибки и `|C(CH3) выводило скобку влево, т.к x ~ -1E-17
            if (dir.x < -0.0001) this.checkRtl(ctx, node);
          });
        }
      }
      const [n1, n2] = this.begin.nodes;
      if (n1?.subChain !== n2?.subChain) {
        this.isBridge = true;
      }
    }
  }
}
