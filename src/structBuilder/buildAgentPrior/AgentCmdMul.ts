import { ChemMul } from "../../core/ChemMul";
import { PAgentCtx } from "./PAgentCtx";
import { FigText } from "../../drawSys/figures/FigText";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrOpen } from "./AgentCmdBrOpen";
import { getNodeInfo } from "../NodeInfo";
import { createCoeff } from "./createCoeff";
import { AgentCmdMulBridge } from "./AgentCmdMulBridge";

export const createAgentCmdMul = (mul: ChemMul): AgentCmd =>
  mul.nodes[0] ? new AgentCmdMulBridge(mul) : new AgentCmdMul(mul);

export class AgentCmdMul extends AgentCmd {
  figure?: FigText;

  constructor(public readonly mul: ChemMul) {
    super();
  }

  override onPrevious(cmd: AgentCmd): void {
    // множитель внутри скобок. Н.р [2H2O] - это формула для теста, но не имеет практического смысла.
    // Команды: brBegin, mulBegin, Node, mulEnd, brEnd
    // Более правдоподобный случай ['n'FeO*'m'Fe2O3*'k'H2O]
    // Ситуация редкая, но без скобок первый коэффициент применяется не к первому узлу, а ко всему выражению
    // TODO: Возможно, анализ ситуации перенести в компилятор
    if (cmd instanceof AgentCmdBrOpen) {
      const { begin } = cmd;
      if (!begin.nodes[1]) {
        // eslint-disable-next-line prefer-destructuring
        begin.nodes[1] = this.mul.nodes[1];
      }
      // eslint-disable-next-line no-param-reassign
      cmd.dstCmd = this;
    }
  }

  override canPush(ctx: PAgentCtx): boolean {
    const dstNode = this.mul.nodes[1];
    const { n } = this.mul;
    if (dstNode && n.isSpecified()) {
      const ni = getNodeInfo(dstNode, ctx.nodesInfo);
      const { cluster } = ctx.clusters.findByNode(dstNode);
      const { frame } = cluster;
      const figK = createCoeff(this.mul, ctx.props);
      figK.org.set(
        frame.bounds.left - figK.bounds.width,
        ni.res.rcNodeCore.bottom + ni.res.nodeFrame.org.y
      );
      frame.addFigure(figK, true);
      this.figure = figK;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  override postExec(): void {}
}
