import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { FigPath } from "../../../drawSys/figures/FigPath";
import { compile } from "../../../compiler/compile";
import {
  createTestImgProps,
  createTestStyle,
  createTestSurface,
  saveSurface,
} from "../../tests/testEnv";
import { buildAgentPrior } from "../buildAgentPrior";
import { FigText } from "../../../drawSys/figures/FigText";
import { ChemBracketBegin, ChemBracketEnd } from "../../../core/ChemBracket";
import { ChemNode } from "../../../core/ChemNode";
import { makeTextFormula } from "../../../inspectors/makeTextFormula";

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
    //          │ | │
    // ┌   H   ┐│ O │
    // │   |   ││ | │
    // │   N   ││ C │
    // │ H   H ││ | │
    // └       ┘└ O ┘
    //
    const expr = compile("(H|N<`/H><\\H>)[C<`|O`|H><||O>]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-b2b", agentFrame, surface);
    const bracketFrames = agentFrame.figures.filter(
      (fig) =>
        fig instanceof FigFrame &&
        fig.figures.length === 1 &&
        fig.figures[0] instanceof FigPath
    );
    expect(bracketFrames).toHaveLength(4);
    const src = bracketFrames[1]!.getRelativeBounds();
    const dst = bracketFrames[2]!.getRelativeBounds();
    expect(src.top - (dst.height - src.height) / 2).toBeCloseTo(dst.top);
    expect(src.bottom + (dst.height - src.height) / 2).toBeCloseTo(dst.bottom);
    // Теперь выходной узел первой скобки N находится на одном уровне с входным узлом второй скобки C
    // А высота второй скобки отличается на стандартную длину связи
    // expect(src.top - imgProps.line).toBeCloseTo(dst.top);
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
  it("Vertical alignment of connected brackets", () => {
    //  +  *  + +  *  +3+
    //  | / \ | | / \ |
    //  +*   *+ +*   *+
    //  0123456 7890123 - commands
    //             1111
    const expr = compile("[/\\][/\\]^3+");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands.length).toBe(14);
    expect(commands[0]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[6]).toBeInstanceOf(ChemBracketEnd);
    expect(commands[7]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[13]).toBeInstanceOf(ChemBracketEnd);

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    const { figures } = agentFrame;
    expect(figures.length).toBe(14);
    // Фигура скобки представлена фреймом, внутри которого первый элемент FigPath
    // (Связь - FigPath, узел - пустой фрейм)
    const bb = figures.filter(
      (fig) => fig instanceof FigFrame && fig.figures[0] instanceof FigPath
    );
    expect(bb.length).toBe(4);
    const brc0 = bb[0]!.getRelativeBounds();
    expect(bb[1]!.getRelativeBounds().top).toBeCloseTo(brc0.top);
    expect(bb[1]!.getRelativeBounds().bottom).toBeCloseTo(brc0.bottom);
    expect(bb[2]!.getRelativeBounds().bottom).toBeCloseTo(brc0.bottom);
    expect(bb[3]!.getRelativeBounds().bottom).toBeCloseTo(brc0.bottom);
  });

  it("Direct connection", () => {
    //  |
    //  N(CH2)3F
    //  234  56 :commands
    const expr = compile("|N(CH2)3Cl");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands[2]).toBeInstanceOf(ChemNode);
    const n2 = commands[2] as ChemNode;
    expect(makeTextFormula(n2)).toBe("N");
    expect(commands[3]).toBeInstanceOf(ChemBracketBegin);
    const bb = commands[3] as ChemBracketBegin;
    expect(commands[4]).toBeInstanceOf(ChemNode);
    const n4 = commands[4] as ChemNode;
    expect(makeTextFormula(n4)).toBe("CH2");
    expect(commands[5]).toBeInstanceOf(ChemBracketEnd);
    const be = commands[5] as ChemBracketEnd;
    expect(commands[6]).toBeInstanceOf(ChemNode);
    const n6 = commands[6] as ChemNode;
    expect(makeTextFormula(n6)).toBe("Cl");
    expect(bb.nodes[0]).toBe(n2);
    expect(bb.nodes[1]).toBe(n4);
    expect(be.nodes[0]).toBe(n4);
    expect(be.nodes[1]).toBe(n6);

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-nch2cl", agentFrame, surface);
    const { figures } = agentFrame;
    // console.log(figures);
    // Все узлы, кроме первого (автоматического), рисуются фигурой: фрейм и внутри один или два фрейма с текстом
    const txNodeFrames = figures.filter(
      (topFig) =>
        topFig instanceof FigFrame &&
        topFig.figures.length > 0 &&
        topFig.figures.every((fig) => fig instanceof FigFrame)
    );
    expect(txNodeFrames.length).toBe(3);
    // console.log(txNodeFrames[0]!.getRelativeBounds().toString());
    // console.log(txNodeFrames[1]!.getRelativeBounds().toString());
    // console.log(txNodeFrames[2]!.getRelativeBounds().toString());
  });

  it("Text brackets with different font sizes", () => {
    const expr = compile("[Hg{F}]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40, "black", (props) => {
      // eslint-disable-next-line no-param-reassign
      props.styles.custom = createTestStyle(surface, 50);
      // eslint-disable-next-line no-param-reassign
      props.styles.bracket = createTestStyle(surface, 30);
    });
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-HR", agentFrame, surface);
  });
});
