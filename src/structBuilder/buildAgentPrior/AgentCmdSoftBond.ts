import { ifDef } from "../../utils/ifDef";
import { ChemAgent } from "../../core/ChemAgent";
import { ChemBond } from "../../core/ChemBond";
import { Point } from "../../math/Point";
import { drawBondAB } from "../bond/drawBondAB";
import { softBondTemplate } from "../bond/softBondTemplate";
import { AgentCmdBridge } from "./AgentCmdBridge";
import { PAgentCtx } from "./PAgentCtx";

export class AgentCmdSoftBond extends AgentCmdBridge {
  constructor(
    public readonly bond: ChemBond,
    public readonly agent: ChemAgent
  ) {
    super();
  }

  override postExec(ctx: PAgentCtx): void {
    const {
      bond,
      agent: { stA },
    } = this;
    const imgProps = ctx.props;
    const { src, dst, bondA, bondB } = softBondTemplate(
      bond,
      ctx.props,
      Point.zero
    );
    const [srcNode, dstNode] = this.bond.nodes;
    const step = dst.minus(src);
    const { cluster, srcConn, dstConn, srcNodeInfo, dstNodeInfo } =
      ctx.clusters.unite(
        ctx,
        { node: srcNode!, allBox: !!this.srcCmd },
        { node: dstNode!, allBox: !!this.dstCmd },
        step
      );
    if (bond.isVisible()) {
      const y =
        ifDef(srcConn.yBase, (srcBase) =>
          ifDef(dstConn.yBase, () => {
            if (!srcNodeInfo || !dstNodeInfo) return undefined;
            const srcH = srcNodeInfo.res.rcNodeCore.height ?? 0;
            const dstH = dstNodeInfo.res.rcNodeCore.height ?? 0;
            return srcBase - Math.min(srcH / 2, dstH / 2);
          })
        ) ?? srcConn.yMiddle;
      const connPt = new Point(srcConn.x, y);
      bondA.iadd(connPt);
      bondB.iadd(connPt);
      drawBondAB({ bond, bondA, bondB, frame: cluster.frame, imgProps, stA });
    }
  }
}
