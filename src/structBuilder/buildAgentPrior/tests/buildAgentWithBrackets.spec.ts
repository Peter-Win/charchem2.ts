import { PathSegPt } from "../../../drawSys/path";
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
import { textFormula } from "../../../textBuilder/textFormula";

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
    const figNode0 = figures[0] as FigFrame;
    expect(figNode0).toBeInstanceOf(FigFrame);
    expect(figNode0.figures[0]).toBeInstanceOf(FigFrame);
    expect((figNode0.figures[0] as FigFrame).figures[0]).toHaveProperty(
      "text",
      "H"
    );
    expect((figNode0.figures[0] as FigFrame).figures[1]).toHaveProperty(
      "text",
      "3"
    );
    expect(figNode0.figures[1]).toBeInstanceOf(FigFrame);
    expect((figNode0.figures[1] as FigFrame).figures[0]).toHaveProperty(
      "text",
      "C"
    );

    const figNode1 = figures[1] as FigFrame;
    expect(figNode1).toBeInstanceOf(FigFrame);
    expect(figNode1.figures[0]).toBeInstanceOf(FigFrame);
    expect((figNode1.figures[0] as FigFrame).figures[0]).toHaveProperty(
      "text",
      "C"
    );
    expect((figNode1.figures[1] as FigFrame).figures[0]).toHaveProperty(
      "text",
      "H"
    );
    expect((figNode1.figures[1] as FigFrame).figures[1]).toHaveProperty(
      "text",
      "2"
    );

    const figBrOpen = figures[2] as FigFrame;
    expect(figBrOpen).toBeInstanceOf(FigFrame);
    expect(figBrOpen.figures[0]).toBeInstanceOf(FigText);
    expect(figBrOpen.figures[0]).toHaveProperty("text", "(");

    const figBrClose = figures[3] as FigFrame;
    expect(figBrClose.figures[0]).toHaveProperty("text", ")");
    expect(figBrClose.figures[1]).toHaveProperty("text", "4");

    const figNodeLast = figures[4] as FigFrame;
    expect(figNodeLast).toBeInstanceOf(FigFrame);
    expect((figNodeLast.figures[0] as FigFrame).figures[0]).toHaveProperty(
      "text",
      "N"
    );
    expect((figNodeLast.figures[1] as FigFrame).figures[0]).toHaveProperty(
      "text",
      "H"
    );
    expect((figNodeLast.figures[1] as FigFrame).figures[1]).toHaveProperty(
      "text",
      "2"
    );
    const { top } = figNode0.getRelativeBounds();
    expect(figNode1.getRelativeBounds().top).toBe(top);
    expect(figBrOpen.getRelativeBounds().top).toBe(top);
    expect(figBrClose.getRelativeBounds().top).toBe(top);
    expect(figNodeLast.getRelativeBounds().top).toBe(top);
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
    expect(textFormula(n2, "text")).toBe("N");
    expect(commands[3]).toBeInstanceOf(ChemBracketBegin);
    const bb = commands[3] as ChemBracketBegin;
    expect(commands[4]).toBeInstanceOf(ChemNode);
    const n4 = commands[4] as ChemNode;
    expect(textFormula(n4, "text")).toBe("CH2");
    expect(commands[5]).toBeInstanceOf(ChemBracketEnd);
    const be = commands[5] as ChemBracketEnd;
    expect(commands[6]).toBeInstanceOf(ChemNode);
    const n6 = commands[6] as ChemNode;
    expect(textFormula(n6, "text")).toBe("Cl");
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

  it("Wrong space", () => {
    //           nodes   problem  right side
    //   H -(O)  0 -(1)  H-  (O)  (O)  -H
    //       |       |        |    |
    //   F - +   3 - 2      F-+    +-F
    // H - first subchain, rest - next subchain
    // PS: Same case for right side: F`-`|(O)-H
    const expr = compile("H-(O)|`-F");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-softSpace", agentFrame, surface);
    // bond |: vert line (112.94, 17.56) to (112.94, 64)
    // bond `-: ltr horiz line (112.94, 64) to (59.83, 64)
    // H: Frame>Frame>Text
    // O: Frame>Frame>Text
    // auto node: Frame. bounds: {0, 0, 0, 0} , org: (112.94, 64)
    // R: Frame>Frame>Frame>Text
    // (: Frame>Text. org=(83.02, 15.56)
    // ): Frame>Text
    // soft bond -: horiz line (15.55, 0) to (38.05, 0)
    const figSoftBonds = agentFrame.figures.filter(
      (f) =>
        f instanceof FigPath &&
        f.segs.length === 2 &&
        f.segs[0]!.cmd === "M" &&
        f.segs[1]!.cmd === "L" &&
        (f.segs[0] as PathSegPt).pt.x < (f.segs[1] as PathSegPt).pt.x
    );
    expect(figSoftBonds.length).toBe(1);
    const figBrackets = agentFrame.figures.filter(
      (f) =>
        f instanceof FigFrame &&
        f.figures.length === 1 &&
        f.figures[0] instanceof FigText
    );
    expect(figBrackets.length).toBe(2);
    const figSoftBond = figSoftBonds[0] as FigPath;
    const figOpenBr = figBrackets[0]!;
    const { strokeWidth = 1 } = figSoftBond.style;
    expect(
      figSoftBond.getRelativeBounds().right +
        imgProps.nodeMargin -
        strokeWidth / 2
    ).toBeCloseTo(figOpenBr.getRelativeBounds().left);
  });

  const findTextBracket = (agentFrame: FigFrame, bracketText: string) =>
    agentFrame.figures.find(
      (f) =>
        f instanceof FigFrame &&
        f.figures.length === 1 &&
        f.figures[0] instanceof FigText &&
        f.figures[0].text === bracketText
    );

  it("GraphTextConnection", () => {
    // Bug: Если текстовая скобка идет после графической, где последняя связь ltr, то текстовая оказывается справа.
    // Но влиять на направление должна не внутренняя, а внешняя связь
    // Expected:    In Bug
    // ┌     ┐          ┌     ┐
    // │   | │          │   | │
    // │ H-O │(Hg)  (Hg)│ H-O │
    // └     ┘          └     ┘
    // reason: invalid direction from internal soft bond O`-H
    //
    //
    const expr = compile("[|O`-H](Hg)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-GrTxConn", agentFrame, surface);
    // Find all graphic brackets
    const grBrackets = agentFrame.figures.filter(
      (f) =>
        f instanceof FigFrame &&
        f.figures.length === 1 &&
        f.figures[0] instanceof FigPath &&
        f.figures[0].segs.length > 2
    );
    expect(grBrackets.length).toBe(2);
    const grClose = grBrackets[1]!;
    // Find open text bracket
    const txOpen = findTextBracket(agentFrame, "(");
    expect(txOpen).toBeDefined();
    expect(txOpen!.getRelativeBounds().left).toBeGreaterThan(
      grClose.getRelativeBounds().right
    );
  });

  it("ltrTxtBrackets", () => {
    // H`-[O](CH2-O-CH2){F}  =>  {F}(CH2-O-CH2)[O]-H
    const expr = compile("H`-[O](CH2-O-CH2){{F}}");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame, ctx } = buildAgentPrior(agent, imgProps);
    saveSurface("buildAgentWithBrackets-ltrTxt", agentFrame, surface);
    // console.log("ctx.rtlNodes", ctx.rtlNodes)
    expect(Array.from(ctx.rtlNodes)).toEqual([1, 4, 5]);
    const openFirst = findTextBracket(agentFrame, "[");
    expect(openFirst).toBeDefined();
    const closeFirst = findTextBracket(agentFrame, "]");
    expect(closeFirst).toBeDefined();
    const openSecond = findTextBracket(agentFrame, "(");
    expect(openSecond).toBeDefined();
    const closeSecond = findTextBracket(agentFrame, ")");
    expect(closeSecond).toBeDefined();
    const closeThird = findTextBracket(agentFrame, "}");
    expect(closeThird).toBeDefined();
    const openFirstLeft = openFirst!.getRelativeBounds().left;
    const closeSecondRight = closeSecond!.getRelativeBounds().right;
    expect(closeSecondRight).toBeLessThan(openFirstLeft); // ")" < "["
    const openSecondLeft = openSecond!.getRelativeBounds().left;
    const closeThirdRight = closeThird!.getRelativeBounds().right;
    expect(closeThirdRight).toBeLessThan(openSecondLeft); // "}" < "("
  });
});
