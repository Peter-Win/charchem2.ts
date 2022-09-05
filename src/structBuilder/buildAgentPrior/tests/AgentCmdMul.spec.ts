import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { compile } from "../../../compiler/compile";
import {
  createTestImgProps,
  createTestSurface,
  saveSurface,
} from "../../tests/testEnv";
import { buildAgentPrior } from "../buildAgentPrior";
import { FigText } from "../../../drawSys/figures/FigText";
import { ChemBracketBegin, ChemBracketEnd } from "../../../core/ChemBracket";
import { ChemNode } from "../../../core/ChemNode";
import { ChemMul, ChemMulEnd } from "../../../core/ChemMul";
import { PAgentCtx } from "../PAgentCtx";
import { processCommands } from "../processCommands";
import { prepareNodes } from "../prepareNodes";

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

  it("Mul after bracket", () => {
    const expr = compile("[H]*5O");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands[0]).toBeInstanceOf(ChemBracketBegin);

    let chain;
    let subChain1;
    {
      const cmd1 = commands[1] as ChemNode;
      expect(cmd1).toBeInstanceOf(ChemNode);
      expect(cmd1.index).toBe(0);
      chain = cmd1.chain;
      subChain1 = cmd1.subChain;
    }

    {
      const cmd2 = commands[2] as ChemBracketEnd;
      expect(cmd2).toBeInstanceOf(ChemBracketEnd);
      expect(cmd2.nodes[0]?.index).toBe(0);
      // expect(cmd2.nodes[1]?.index).toBe(1); Следующий узел не установлен из-за наличия множителя
    }

    {
      const cmd3 = commands[3] as ChemMul;
      expect(cmd3).toBeInstanceOf(ChemMul);
      expect(cmd3.isFirst).toBe(false);
      // Первого узла может не быть из-за скобок.
      expect(cmd3.nodes[1]?.index).toBe(1); // А второй должен быть.
    }

    {
      const cmd4 = commands[4] as ChemNode;
      expect(cmd4).toBeInstanceOf(ChemNode);
      expect(cmd4.chain).toBe(chain);
      expect(cmd4.subChain).toBe(subChain1 + 1);
    }

    expect(commands[5]).toBeInstanceOf(ChemMulEnd);

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const ctx = new PAgentCtx(agent, imgProps);
    prepareNodes(ctx);
    processCommands(ctx);
    expect(ctx.clusters.clusters.length).toBe(1);
  });
  it("Multiplier + bracket", () => {
    const expr = compile("H*5[O]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands[0]).toBeInstanceOf(ChemNode);

    const cmd1 = commands[1] as ChemMul;
    expect(cmd1).toBeInstanceOf(ChemMul);
    expect(cmd1.nodes[0]?.index).toBe(0);
    expect(cmd1.nodes[1]?.index).toBe(1);

    expect(commands[2]).toBeInstanceOf(ChemBracketBegin);

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    const figMulK = agentFrame.figures.find(
      (f) =>
        f instanceof FigFrame &&
        f.figures[1] instanceof FigText &&
        f.figures[1].text === "5"
    );
    expect(figMulK).toBeDefined();
    const figBB = agentFrame.figures.find(
      (f) =>
        f instanceof FigFrame &&
        f.figures[0] instanceof FigText &&
        f.figures[0].text === "["
    );
    expect(figBB).toBeDefined();
    expect(figMulK!.getRelativeBounds().right).toBeLessThanOrEqual(
      figBB!.getRelativeBounds().left + 0.01
    );
  });
  it("Empty node + multiplier", () => {
    // Correct image for C-O*3H
    // Problem in C-{}*3H
    const expr = compile("C-{}*3H");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("AgentCmdMul-emptyNode-mul", agentFrame, surface);
    // Фрейм для атома C
    const frC = agentFrame.figures.find(
      (fr) =>
        fr instanceof FigFrame && // фрейм узла
        fr.figures.length === 1 &&
        fr.figures[0] instanceof FigFrame && // фрейм элемента узла
        fr.figures[0].figures.length === 1 &&
        fr.figures[0].figures[0] instanceof FigText && // текст C
        fr.figures[0].figures[0].text === "C"
    );
    expect(frC).toBeDefined();
    // Фрейм множителя содержит две текстовых фигуры: символ множителя и коэффициент
    const frMul = agentFrame.figures.find(
      (fr) => fr instanceof FigFrame && fr.figures.length === 2
    );
    expect(frMul).toBeDefined();
    // Важно, чтобы по высоте они должны совпасть (т.к. используется одинаковый шрифт)
    const rcC = frC!.getRelativeBounds();
    const rcMul = frMul!.getRelativeBounds();
    expect(rcC.top).toBeCloseTo(rcMul.top);
    expect(rcC.bottom).toBeCloseTo(rcMul.bottom);
  });
});
