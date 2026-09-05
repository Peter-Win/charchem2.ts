import { ifDef } from "../../utils/ifDef";
import { ChemAgent } from "../../core/ChemAgent";
import { ChemBond } from "../../core/ChemBond";
import { Point } from "../../math/Point";
import { drawBondAB } from "../bond/drawBondAB";
import { softBondTemplate } from "../bond/softBondTemplate";
import { AgentCmdBridge } from "./AgentCmdBridge";
import { PAgentCtx } from "./PAgentCtx";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrOpen } from "./AgentCmdBrOpen";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { getNodeInfo } from "../NodeInfo";

export class AgentCmdSoftBond extends AgentCmdBridge {
  constructor(
    public readonly bond: ChemBond,
    public readonly agent: ChemAgent,
  ) {
    super();
  }

  isBranchBracket = false;

  outBracket?: AgentCmdBrClose;

  override onPrevious(cmd: AgentCmd): void {
    if (cmd instanceof AgentCmdBrOpen) {
      if (cmd.begin.isBranchBracket && cmd.begin.bond === this.bond) {
        this.isBranchBracket = true;
      }
    }
    if (cmd instanceof AgentCmdBrClose) {
      // ]-
      if (
        cmd.end.isBranchBracket &&
        cmd.end.begin.nodes[0] === this.bond.nodes[0]
      ) {
        this.outBracket = cmd;
      }
    }
  }

  override postExec(ctx: PAgentCtx): void {
    const { bond } = this;
    const { stA } = this.agent;
    const imgProps = ctx.props;
    const { src, dst, bondA, bondB } = softBondTemplate(
      bond,
      ctx.props,
      Point.zero,
    );
    const [srcNode, dstNode] = this.bond.nodes;
    const step = dst.minus(src);
    if (this.isBranchBracket) {
      // case (=O)
      if (bond.isVisible() && dstNode) {
        const ni = getNodeInfo(dstNode, ctx.nodesInfo);
        const frame = ni.res.nodeFrame;
        const dstH = ni.res.rcNodeCore.height ?? 0;
        const offset = src.minus(dst);
        offset.y -= dstH / 2;

        drawBondAB({
          bond,
          bondA: bondA.plus(offset),
          bondB: bondB.plus(offset),
          frame,
          imgProps,
          stA,
        });
        frame.update();
      }
    } else if (this.outBracket) {
      // стыковка мягкой связи с предыдущей скобкой-веткой
      const srcNode1 = this.outBracket.end.nodes[0];
      const dstNode1 = this.bond.nodes[1];
      if (srcNode1 && dstNode1) {
        const srcNodeInfo = getNodeInfo(srcNode1, ctx.nodesInfo);
        const dstNodeInfo = getNodeInfo(dstNode1, ctx.nodesInfo);
        const { cluster, srcConn, dstConn } = ctx.clusters.unite(
          ctx,
          { node: srcNode1, allBox: !this.outBracket.isRealText },
          { node: dstNode1, allBox: false }, // это не точно. теоретически, связь может быть между двумя скобками
          step,
        );

        // копипаста
        if (bond.isVisible()) {
          const y =
            ifDef(srcConn.yBase, (srcBase) =>
              ifDef(dstConn.yBase, () => {
                if (!srcNodeInfo || !dstNodeInfo) return undefined;
                const srcH = srcNodeInfo.res.rcNodeCore.height ?? 0;
                const dstH = dstNodeInfo.res.rcNodeCore.height ?? 0;
                return srcBase - Math.min(srcH / 2, dstH / 2);
              }),
            ) ?? srcConn.yMiddle;
          const connPt = new Point(srcConn.x, y);
          bondA.iadd(connPt);
          bondB.iadd(connPt);
          drawBondAB({
            bond,
            bondA,
            bondB,
            frame: cluster.frame,
            imgProps,
            stA,
          });
        }
      }
    } else {
      const { cluster, srcConn, dstConn, srcNodeInfo, dstNodeInfo } =
        ctx.clusters.unite(
          ctx,
          { node: srcNode!, allBox: !!this.srcCmd },
          { node: dstNode!, allBox: !!this.dstCmd },
          step,
        );

      if (bond.isVisible()) {
        const y =
          ifDef(srcConn.yBase, (srcBase) =>
            ifDef(dstConn.yBase, () => {
              if (!srcNodeInfo || !dstNodeInfo) return undefined;
              const srcH = srcNodeInfo.res.rcNodeCore.height ?? 0;
              const dstH = dstNodeInfo.res.rcNodeCore.height ?? 0;
              return srcBase - Math.min(srcH / 2, dstH / 2);
            }),
          ) ?? srcConn.yMiddle;
        const connPt = new Point(srcConn.x, y);
        bondA.iadd(connPt);
        bondB.iadd(connPt);
        drawBondAB({ bond, bondA, bondB, frame: cluster.frame, imgProps, stA });
      }
    }
  }
}
