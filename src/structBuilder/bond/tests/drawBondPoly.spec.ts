import { lastItem } from "../../../utils/lastItem";
import { compile } from "../../../compiler/compile";
import {
  buildAgentPrior,
  ResultBuildAgent,
} from "../../buildAgentPrior/buildAgentPrior";
import {
  createTestImgProps,
  createTestSurface,
  saveSurface,
} from "../../tests/testEnv";
import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { drawBondPoly } from "../drawBondPoly";
import { FigEllipse } from "../../../drawSys/figures/FigEllipse";

const build = (formula: string, imgName?: string): ResultBuildAgent => {
  const expr = compile(formula);
  if (expr.error) throw expr.error;
  const agent = expr.getAgents()[0]!;
  const surface = createTestSurface();
  const imgProps = createTestImgProps(surface, 40);
  const res = buildAgentPrior(agent, imgProps);
  if (imgName) saveSurface(imgName, res.agentFrame, surface);
  return res;
};

describe("drawBondPoly", () => {
  it("Round", () => {
    const {
      ctx: { agent, props, nodesInfo },
      center,
    } = build("/\\|`/`\\`|_o", "drawBondPoly_round");
    const oBond = lastItem(agent.bonds)!;
    expect(oBond.nodes).toHaveLength(6);
    expect(oBond.ext).toBe("o");
    const frame = new FigFrame();
    drawBondPoly(oBond, frame, props, nodesInfo);
    expect(frame.figures.length).toBe(1);
    expect(frame.figures[0]).toBeInstanceOf(FigEllipse);
    const fig = frame.figures[0] as FigEllipse;
    expect(String(fig.org)).toBe(String(center));
  });
  it("Non-ring", () => {
    const {
      ctx: { agent },
    } = build("_(x2)\\<->`/_(x-2)`\\/_s()");
    const sBond = lastItem(agent.bonds)!;
    expect(sBond.nodes).toHaveLength(6);
    expect(sBond.isCycle).toBe(true);
    expect(sBond.ext).toBe("s");
  });
});
