/*
 Максимальный приоритет имеет цвет, указанный внутри формулы функциями $color, $atomColor, $itemColor
 Следующий по значимости - цвет из стиля
 Еще ниже - цвет из стандартного стиля
 И если ничего из этого не указано, значит black
*/

import { ChemNodeItem } from "../../core/ChemNodeItem";
import { compile } from "../../compiler/compile";
import { buildAgentPrior } from "../buildAgentPrior/buildAgentPrior";
import { createTestImgProps, createTestSurface } from "./testEnv";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { FigText } from "../../drawSys/figures/FigText";
import { FigPath } from "../../drawSys/figures/FigPath";

describe("colors", () => {
  it("node items", () => {
    // 0123
    // ROH↑
    const expr = compile(`2{R}$atomColor1(blue)OH"|^"`);
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes.length).toBe(1);
    const node = agent.nodes[0]!;
    expect(node.items.length).toBe(4);
    const getColor = (it: ChemNodeItem): string | undefined =>
      it.atomColor || it.color;
    expect(getColor(node.items[0]!)).toBeUndefined();
    expect(getColor(node.items[1]!)).toBe("blue");
    expect(getColor(node.items[2]!)).toBeUndefined();
    expect(getColor(node.items[3]!)).toBeUndefined();

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 100, "#111", (imgProps0) => {
      const { styles, stdStyle } = imgProps0;
      styles.custom = { ...stdStyle, style: { fill: "red" } };
      styles.comment = { ...stdStyle, style: { fill: "gray" } };
      styles.agentK = { ...stdStyle, style: { fill: "#008" } };
    });
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    expect(agentFrame.figures.length).toBe(2); // node frame and agent coeff

    // agentK
    const figK = agentFrame.figures[1] as FigText;
    expect(figK).toBeInstanceOf(FigText);
    expect(figK.text).toBe("2");
    expect(imgProps.getStyle("agentK").style.fill).toBe("#008");
    expect(figK.style.fill).toBe("#008");

    // node items
    const nodeFrame = agentFrame.figures[0] as FigFrame;
    expect(nodeFrame).toBeInstanceOf(FigFrame);
    expect(nodeFrame.figures.length).toBe(4);

    // red color from custom style
    {
      const frItem0 = nodeFrame.figures[0] as FigFrame;
      expect(frItem0).toBeInstanceOf(FigFrame);
      expect(frItem0.figures.length).toBe(1);
      const frMarkup0 = frItem0.figures[0] as FigFrame;
      expect(frMarkup0).toBeInstanceOf(FigFrame);
      const tx0 = frMarkup0.figures[0] as FigText;
      expect(tx0).toBeInstanceOf(FigText);
      expect(tx0.text).toBe("R");
      expect(
        imgProps.getStyleColored("custom", getColor(node.items[0]!)).style.fill
      ).toBe("red");
      expect(tx0.style.fill).toBe("red");
    }

    // blue color from $atomColor1
    {
      const frItem1 = nodeFrame.figures[1] as FigFrame;
      expect(frItem1).toBeInstanceOf(FigFrame);
      expect(frItem1.figures.length).toBe(1);
      const tx1 = frItem1.figures[0] as FigText;
      expect(tx1).toBeInstanceOf(FigText);
      expect(tx1.text).toBe("O");
      expect(tx1.style.fill).toBe("blue");
    }

    // atom style is not defined, so used default style with fill color = #111
    {
      const frItem2 = nodeFrame.figures[2] as FigFrame;
      expect(frItem2).toBeInstanceOf(FigFrame);
      expect(frItem2.figures.length).toBe(1);
      const tx2 = frItem2.figures[0] as FigText;
      expect(tx2).toBeInstanceOf(FigText);
      expect(tx2.text).toBe("H");
      expect(tx2.style.fill).toBe("#111");
    }

    // comment style - gray
    {
      const frItem3 = nodeFrame.figures[3] as FigFrame;
      expect(frItem3).toBeInstanceOf(FigFrame);
      expect(frItem3.figures.length).toBe(1);
      const frMarkup3 = frItem3.figures[0] as FigFrame;
      expect(frMarkup3).toBeInstanceOf(FigFrame);
      const tx3 = frMarkup3.figures[0] as FigText;
      expect(tx3).toBeInstanceOf(FigText);
      expect(tx3.text).toBe("↑");
      expect(
        imgProps.getStyleColored("comment", getColor(node.items[3]!)).style.fill
      ).toBe("gray");
      expect(tx3.style.fill).toBe("gray");
    }
  });
  it("bonds", () => {
    const expr = compile("|$color(green)-$color()`|");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds.length).toBe(3);
    expect(agent.bonds[0]!.color).toBeUndefined();
    expect(agent.bonds[1]!.color).toBe("green");
    expect(agent.bonds[2]!.color).toBeUndefined();

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 100, "");
    const { agentFrame } = buildAgentPrior(agent, imgProps);
    const figures = agentFrame.figures.filter(
      (f) => !(f instanceof FigFrame && f.figures.length === 0)
    );
    expect(figures.length).toBe(3); // node frame and agent coeff
    expect(figures[0]).toBeInstanceOf(FigPath);
    expect(figures[1]).toBeInstanceOf(FigPath);
    expect(figures[2]).toBeInstanceOf(FigPath);
    expect((figures[0] as FigPath).style.stroke).toBe("black");
    expect((figures[1] as FigPath).style.stroke).toBe("green");
    expect((figures[2] as FigPath).style.stroke).toBe("black");
  });
});
