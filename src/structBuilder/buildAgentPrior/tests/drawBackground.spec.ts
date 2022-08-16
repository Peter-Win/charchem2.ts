import { compile } from "../../../compiler/compile";
import { buildAgentPrior, ResultBuildAgent } from "../buildAgentPrior";
import {
  createTestImgProps,
  createTestSurface,
  saveSurface,
} from "../../tests/testEnv";

import { applyPadding, calcBgRect, makeBackFigure } from "../drawBackground";
import {
  ChemBackground,
  ParamsChemBackground,
} from "../../../core/ChemBackground";
import { FigRect } from "../../../drawSys/figures/FigRect";
import { Rect } from "../../../math/Rect";
import { FigEllipse } from "../../../drawSys/figures/FigEllipse";
import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { Point } from "../../../math/Point";

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

describe("calcBgRect", () => {
  const { ctx } = build("H\\N<|H>/H");
  const {
    nodesInfo,
    agent: { nodes },
  } = ctx;
  const rc1 = nodesInfo[1]!.res.nodeFrame.getRelativeBounds();
  const rc2 = nodesInfo[2]!.res.nodeFrame.getRelativeBounds();
  it("single", () => {
    expect(String(calcBgRect(ctx, [nodes[1]!]))).toBe(String(rc1));
    expect(String(calcBgRect(ctx, [nodes[2]!]))).toBe(String(rc2));
  });
  it("two", () => {
    const res = rc1.clone().unite(rc2);
    expect(String(calcBgRect(ctx, nodes.slice(1, 3)))).toBe(String(res));
  });
  it("empty", () => {
    expect(calcBgRect(ctx, [])).toBeUndefined();
  });
});

describe("applyPadding", () => {
  it("single value", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-50, -50, 150, 150);
    expect(String(applyPadding(src, [5], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
  it("two values: vert and horiz", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-10, -50, 110, 150);
    expect(String(applyPadding(src, [5, 1], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
  it("three values: top, horiz and bottom", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-20, -10, 120, 130);
    expect(String(applyPadding(src, [1, 2, 3], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
  it("four values: top, left, bottom, right", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-40, -10, 120, 130);
    expect(String(applyPadding(src, [1, 2, 3, 4], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
});

describe("makeBackFigure", () => {
  const { ctx } = build("H\\N<|H>/H");
  const {
    nodesInfo,
    agent: { nodes },
  } = ctx;
  const rc1 = nodesInfo[1]!.res.nodeFrame.getRelativeBounds();
  const rc2 = nodesInfo[2]!.res.nodeFrame.getRelativeBounds();
  it("Rect with 2 nodes", () => {
    const params: ParamsChemBackground = {
      nodes: nodes.slice(1, 3),
      fill: "yellow",
    };
    const fig = makeBackFigure(ctx, params) as FigRect;
    expect(fig).toBeInstanceOf(FigRect);
    expect(fig.style).toEqual({ fill: "yellow" });
    expect(String(fig.bounds)).toBe(String(rc1.clone().unite(rc2)));
  });
  it("Around all reagent", () => {
    const params: ParamsChemBackground = {
      isAll: true,
      fill: "#CCC",
      shape: "round",
    };
    const fig = makeBackFigure(ctx, params) as FigEllipse;
    expect(fig).toBeInstanceOf(FigEllipse);
    const { bounds } = ctx.agentFrame;
    expect(String(fig.org)).toBe(String(bounds.center));
    expect(fig.radius.x).toBeCloseTo(fig.radius.y);
    expect(fig.radius.x).toBeCloseTo(bounds.center.minus(bounds.A).length());
  });
});

describe("drawBackground", () => {
  it("isAll", () => {
    const { agentFrame } = build("$bg(yellow,round,*)C");
    expect(agentFrame.figures.length).toBe(2);
    const f1 = agentFrame.figures[1] as FigFrame;
    expect(f1).toBeInstanceOf(FigFrame);
    expect((f1.figures[0] as FigFrame).figures[0]!).toHaveProperty("text", "C");
    const round = agentFrame.figures[0] as FigEllipse;
    expect(round).toBeInstanceOf(FigEllipse);
    const frCenter = agentFrame.bounds.center;
    expect(String(round.org)).toBe(String(frCenter));
    expect(round.style.fill).toBe("yellow");
  });
  it("Border radius", () => {
    const { ctx } = build(
      "$bg(yellow,p:.2,r:.3)H|OH",
      "drawBackground-borderRadius"
    );
    const { agent, agentFrame } = ctx;
    const bg = agent.commands[1] as ChemBackground;
    expect(bg).toBeInstanceOf(ChemBackground);
    expect(bg.params.borderRadius).toBeCloseTo(0.3);
    const figBg = agentFrame.figures[0] as FigRect;
    expect(figBg).toBeInstanceOf(FigRect);
    const r = ctx.props.line * 0.3;
    expect(String(figBg.radius)).toBe(String(new Point(r, r)));
  });
});
