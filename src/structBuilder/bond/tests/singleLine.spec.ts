import { ChemBond } from "../../../core/ChemBond";
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
import { FigPath } from "../../../drawSys/figures/FigPath";
import { FigFrame } from "../../../drawSys/figures/FigFrame";

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

describe("singleLine", () => {
  it("Thick", () => {
    const { ctx, agentFrame } = build("_(A0,SI)");
    const { bonds } = ctx.agent;
    expect(bonds.length).toBe(1);
    const bond = bonds[0]!;
    expect(bond).toBeInstanceOf(ChemBond);
    expect(bond.style).toBe("I");

    expect(agentFrame.figures).toHaveLength(3);
    expect(agentFrame.figures[1]).toBeInstanceOf(FigFrame);
    expect(agentFrame.figures[2]).toBeInstanceOf(FigFrame);
    const figBond = agentFrame.figures[0] as FigPath;
    expect(figBond).toBeInstanceOf(FigPath);
    expect(figBond.style.strokeWidth).toBe(ctx.props.thickWidth);
    expect(figBond.segs).toHaveLength(2);
    expect(figBond.segs[0]!.cmd).toBe("M");
    expect(figBond.segs[1]!.cmd).toBe("L");
  });
  it("Thick with w2", () => {
    const { ctx, agentFrame } = build("_(A0,w2)");
    const { bonds } = ctx.agent;
    expect(bonds.length).toBe(1);
    const bond = bonds[0]!;
    expect(bond).toBeInstanceOf(ChemBond);
    expect(bond.style).toBe("");
    expect(bond.w0).toBe(1);
    expect(bond.w1).toBe(1);

    expect(agentFrame.figures).toHaveLength(3);
    expect(agentFrame.figures[1]).toBeInstanceOf(FigFrame);
    expect(agentFrame.figures[2]).toBeInstanceOf(FigFrame);
    const figBond = agentFrame.figures[0] as FigPath;
    expect(figBond).toBeInstanceOf(FigPath);
    expect(figBond.style.strokeWidth).toBe(ctx.props.thickWidth);
    expect(figBond.segs).toHaveLength(2);
    expect(figBond.segs[0]!.cmd).toBe("M");
    expect(figBond.segs[1]!.cmd).toBe("L");
  });
  it("Wave", () => {
    const { ctx, agentFrame } = build("O$L(2)\\~H");
    const { bonds } = ctx.agent;
    expect(bonds.length).toBe(1);
    const bond = bonds[0]!;
    expect(bond).toBeInstanceOf(ChemBond);
    expect(bond.style).toBe("~");
    const paths = agentFrame.figures.filter((f) => f instanceof FigPath);
    expect(paths.length).toBe(1);
    const fig = paths[0] as FigPath;
    const cCount = fig.segs.reduce(
      (sum, seg) => sum + (seg.cmd === "C" ? 1 : 0),
      0
    );
    expect(cCount).toBeGreaterThan(0);
  });
  it("Dashes", () => {
    const { ctx, agentFrame } = build("\\h");
    const { bonds } = ctx.agent;
    expect(bonds.length).toBe(1);
    const bond = bonds[0]!;
    expect(bond).toBeInstanceOf(ChemBond);
    expect(bond.style).toBe(":");
    const paths = agentFrame.figures.filter((f) => f instanceof FigPath);
    expect(paths.length).toBe(1);
    const fig = paths[0] as FigPath;
    const mCount = fig.segs.reduce(
      (sum, seg) => sum + (seg.cmd === "M" ? 1 : 0),
      0
    );
    const lCount = fig.segs.reduce(
      (sum, seg) => sum + (seg.cmd === "L" ? 1 : 0),
      0
    );
    expect(mCount).toBeGreaterThan(1);
    expect(mCount).toBe(lCount);
  });
});
