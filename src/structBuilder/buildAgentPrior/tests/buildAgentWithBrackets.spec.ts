import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { FigPath } from "../../../drawSys/figures/FigPath";
import { compile } from "../../../compiler/compile";
import {
  createTestImgProps,
  createTestSurface,
  saveSurface,
} from "../../tests/testEnv";
import { buildAgentPrior } from "../buildAgentPrior";
import { FigText } from "../../../drawSys/figures/FigText";

describe("buildAgentPrior with brackets", () => {
  it("Text bracket connected with nodes directly", () => {
    const expr = compile("H3C(CH2)4NH2");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-b2n", agentFrame, surface);
    const { figures } = agentFrame;
    expect(figures.length).toBe(5);
    expect(figures[0]).toBeInstanceOf(FigFrame);
    expect((figures[0] as FigFrame).figures[0]).toBeInstanceOf(FigFrame);
    expect(
      ((figures[0] as FigFrame).figures[0] as FigFrame).figures[0]
    ).toHaveProperty("text", "H");
    expect(
      ((figures[0] as FigFrame).figures[0] as FigFrame).figures[1]
    ).toHaveProperty("text", "3");
    expect((figures[0] as FigFrame).figures[1]).toBeInstanceOf(FigFrame);
    expect(
      ((figures[0] as FigFrame).figures[1] as FigFrame).figures[0]
    ).toHaveProperty("text", "C");
    expect(figures[1]).toBeInstanceOf(FigFrame);
    expect((figures[1] as FigFrame).figures[0]).toBeInstanceOf(FigFrame);
    expect(
      ((figures[1] as FigFrame).figures[0] as FigFrame).figures[0]
    ).toHaveProperty("text", "C");
    expect(
      ((figures[1] as FigFrame).figures[1] as FigFrame).figures[0]
    ).toHaveProperty("text", "H");
    expect(
      ((figures[1] as FigFrame).figures[1] as FigFrame).figures[1]
    ).toHaveProperty("text", "2");
    expect(figures[2]).toBeInstanceOf(FigFrame);
    expect((figures[2] as FigFrame).figures[0]).toBeInstanceOf(FigText);
    expect((figures[2] as FigFrame).figures[0]).toHaveProperty("text", "(");
    expect((figures[3] as FigFrame).figures[0]).toHaveProperty("text", ")");
    expect((figures[3] as FigFrame).figures[1]).toHaveProperty("text", "4");
    expect(
      ((figures[4] as FigFrame).figures[0] as FigFrame).figures[0]
    ).toHaveProperty("text", "N");
    expect(
      ((figures[4] as FigFrame).figures[1] as FigFrame).figures[0]
    ).toHaveProperty("text", "H");
    expect(
      ((figures[4] as FigFrame).figures[1] as FigFrame).figures[1]
    ).toHaveProperty("text", "2");
    const { top } = figures[0]!.getRelativeBounds();
    expect(figures[1]!.getRelativeBounds().top).toBe(top);
    expect(figures[2]!.getRelativeBounds().top).toBe(top);
    expect(figures[3]!.getRelativeBounds().top).toBe(top);
    expect(figures[4]!.getRelativeBounds().top).toBe(top);
  });
  it("Connecting two brackets of different heights", () => {
    //          ┌ H ┐
    // ┌   H   ┐│ | │
    // │   |   ││ O │
    // │   N   ││ | │
    // │ H   H ││ C │
    // └       ┘│ | │
    //          └ O ┘
    const expr = compile("(H|N<`/H><\\H>)[C<`|O`|H><||O>]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-b2b", agentFrame, surface);
    const brFrames = agentFrame.figures.filter(
      (fig) =>
        fig instanceof FigFrame &&
        fig.figures.length === 1 &&
        fig.figures[0] instanceof FigPath
    );
    expect(brFrames).toHaveLength(4);
    const src = brFrames[1]!.getRelativeBounds();
    const dst = brFrames[2]!.getRelativeBounds();
    expect(src.top - (dst.height - src.height) / 2).toBeCloseTo(dst.top);
    expect(src.bottom + (dst.height - src.height) / 2).toBeCloseTo(dst.bottom);
  });
  it("Brackets with hard bonds", () => {
    const expr = compile("Cl/[\\\\<|Cl>]4/\\Cl");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-hard", agentFrame, surface);
  });
  it("Text braces", () => {
    const expr = compile("{{Hg(ClO3)2}}");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-textBraces", agentFrame, surface);
  });
  it("Graphic brackets", () => {
    const expr = compile("{{[[(H_p4O_p4O_p4H)]][H|O|H]}}3^+o");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-grBrackets", agentFrame, surface);
  });
});
