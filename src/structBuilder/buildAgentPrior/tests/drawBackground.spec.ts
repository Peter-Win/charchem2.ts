import { compile } from "../../../compiler/compile";
import { buildAgentPrior, ResultBuildAgent } from "../buildAgentPrior";
import { createTestImgProps, createTestSurface } from "../../tests/testEnv";

import { applyPadding, calcBgRect, makeBackFigure } from "../drawBackground";
import { ParamsChemBackground } from "../../../core/ChemBackground";
import { FigRect } from "../../../drawSys/figures/FigRect";
import { Rect } from "../../../math/Rect";

const build = (formula: string): ResultBuildAgent => {
  const expr = compile(formula);
  if (expr.error) throw expr.error;
  const agent = expr.getAgents()[0]!;
  const surface = createTestSurface();
  const imgProps = createTestImgProps(surface, 40);
  return buildAgentPrior(agent, imgProps);
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
});
