import { ChemAgent } from "../core/ChemAgent";
import { ChemOp } from "../core/ChemOp";
import { ChemExpr } from "../core/ChemExpr";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { buildAgentPrior } from "./buildAgentPrior/buildAgentPrior";
import { buildOp } from "./buildOp";
import { StructBuilderCtx } from "./StructBuilderCtx";

interface ResultBuildExpr {
  frame: FigFrame;
}

interface EntityInfo {
  frame: FigFrame;
  y: number;
}

export const buildExpression = (
  expr: ChemExpr,
  ctx: StructBuilderCtx,
): ResultBuildExpr => {
  const frame = new FigFrame();
  let x = 0;
  expr.entities.forEach((obj) => {
    let einfo: EntityInfo | undefined;
    if (obj instanceof ChemAgent) {
      const { agentFrame, center } = buildAgentPrior(obj, ctx);
      einfo = { frame: agentFrame, y: center.y };
    } else if (obj instanceof ChemOp) {
      const { frame: opFrame, center } = buildOp(obj, ctx);
      einfo = { frame: opFrame, y: center.y };
    }
    if (einfo) {
      einfo.frame.org.y -= einfo.y;
      einfo.frame.org.x = x - einfo.frame.bounds.left;
      x += einfo.frame.bounds.width + ctx.imgProps.opSpace;
      frame.addFigure(einfo.frame, true);
    }
  });
  frame.bounds.grow(1); // Небольшое поле позволяет скрыть недостатки определения границ. Иначе отсекаются края.
  return { frame };
};
