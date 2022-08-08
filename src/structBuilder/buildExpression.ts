import { ChemAgent } from "../core/ChemAgent";
import { ChemOp } from "../core/ChemOp";
import { ChemExpr } from "../core/ChemExpr";
import { ChemImgProps } from "../drawSys/ChemImgProps";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { buildAgentPrior } from "./buildAgentPrior/buildAgentPrior";
import { buildOp } from "./buildOp";

interface ResultBuildExpr {
  frame: FigFrame;
}

interface EntityInfo {
  frame: FigFrame;
  y: number;
}

export const buildExpression = (
  expr: ChemExpr,
  props: ChemImgProps
): ResultBuildExpr => {
  const frame = new FigFrame();
  let x = 0;
  expr.entities.forEach((obj) => {
    let einfo: EntityInfo | undefined;
    if (obj instanceof ChemAgent) {
      const { agentFrame, center } = buildAgentPrior(obj, props);
      einfo = { frame: agentFrame, y: center.y };
    } else if (obj instanceof ChemOp) {
      const { frame: opFrame, center } = buildOp(obj, props);
      einfo = { frame: opFrame, y: center.y };
    }
    if (einfo) {
      einfo.frame.org.y -= einfo.y;
      einfo.frame.org.x = x - einfo.frame.bounds.left;
      x += einfo.frame.bounds.width + props.opSpace;
      frame.addFigure(einfo.frame, true);
    }
  });
  return { frame };
};
