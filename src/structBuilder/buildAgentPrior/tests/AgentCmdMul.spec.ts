import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { compile } from "../../../compiler/compile";
import {
  createTestImgProps,
  createTestSurface,
  saveSurface,
} from "../../tests/testEnv";
import { buildAgentPrior } from "../buildAgentPrior";
import { FigText } from "../../../drawSys/figures/FigText";

describe("AgentCmdMul", () => {
  it("Typical multiplier with 2 nodes", () => {
    const expr = compile("HgCO3*3H2O");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("AgentCmdMul-bridgeBetweenNodes", agentFrame, surface);
    const { figures } = agentFrame;
    expect(figures.length).toBe(3);
    expect(figures[2]).toBeInstanceOf(FigFrame);
    const mfr = figures[2] as FigFrame;
    expect(mfr.figures.length).toBe(2);
    const m1 = mfr.figures[0] as FigText;
    const m2 = mfr.figures[1] as FigText;
    expect(m1).toBeInstanceOf(FigText);
    expect(m2).toBeInstanceOf(FigText);
    expect(m1).toHaveProperty("text", imgProps.mulChar);
    expect(m2).toHaveProperty("text", "3");
  });
  it("First coeff inside the brackets", () => {
    const expr = compile("[3H2O]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("AgentCmdMul-first", agentFrame, surface);
    const { figures } = agentFrame;
    expect(figures.length).toBe(4);
    expect(figures[0]).toBeInstanceOf(FigFrame);
    expect((figures[0] as FigFrame).figures[0]).toBeInstanceOf(FigFrame);
    expect(
      ((figures[0] as FigFrame).figures[0] as FigFrame).figures[0]
    ).toHaveProperty("text", "H");
    expect(figures[1]).toBeInstanceOf(FigText);
    expect(figures[1]).toHaveProperty("text", "3");
    expect(figures[2]).toBeInstanceOf(FigFrame);
    expect((figures[2] as FigFrame).figures[0]).toBeInstanceOf(FigText);
    expect((figures[2] as FigFrame).figures[0]).toHaveProperty("text", "[");
    expect(figures[3]).toBeInstanceOf(FigFrame);
    expect((figures[3] as FigFrame).figures[0]).toBeInstanceOf(FigText);
    expect((figures[3] as FigFrame).figures[0]).toHaveProperty("text", "]");
  });
});
