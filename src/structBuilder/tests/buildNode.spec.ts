import { ChemNode } from "../../core/ChemNode";
import { compile } from "../../compiler/compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { buildNode, ResultBuildNode } from "../buildNode";
import { createTestImgProps, createTestSurface, saveSurface } from "./testEnv";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { PathSeg } from "../../drawSys/path";
import { FigPath } from "../../drawSys/figures/FigPath";
import { Point } from "../../math/Point";
import { FigText } from "../../drawSys/figures/FigText";

describe("buildNode", () => {
  it("H2O", () => {
    const expr = compile("H2O");
    expect(expr.getMessage()).toBe("");
    const node: ChemNode = expr.getAgents()[0]!.nodes[0]!;
    expect(makeTextFormula(node)).toBe("H2O");

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 100, "#333");

    const res = buildNode(node, imgProps);
    expect(res).toBeDefined();
    const { nodeFrame } = res as ResultBuildNode;
    expect(nodeFrame.figures).toHaveLength(2);
    const [f1, f2] = nodeFrame.figures as [FigFrame, FigFrame];
    expect(f1).toBeInstanceOf(FigFrame);
    expect(f2).toBeInstanceOf(FigFrame);
    expect(f1.figures).toHaveLength(2);
    expect(f2.figures).toHaveLength(1);
    const [f11, f12] = f1.figures as [FigText, FigText];
    expect(f11).toBeInstanceOf(FigText);
    expect(f12).toBeInstanceOf(FigText);
    expect(f11.text).toBe("H");
    expect(f12.text).toBe("2");
    const [f21] = f2.figures as [FigText];
    expect(f21).toBeInstanceOf(FigText);
    expect(f21.text).toBe("O");

    const root = new FigFrame();
    root.addFigure(nodeFrame);
    root.update();
    const { bounds } = root;
    const segs: PathSeg[] = [
      { cmd: "M", pt: new Point(bounds.A.x, 0) },
      { cmd: "H", x: bounds.B.x },
      { cmd: "M", pt: new Point(0, bounds.A.y) },
      { cmd: "V", y: bounds.B.y },
    ];
    root.addFigure(new FigPath(segs, { stroke: "magenta" }));

    saveSurface("buildNode_H2O", root, surface);
  });

  it("Ammonium", () => {
    const expr = compile("$atomColor1(blue)NH4^+");
    expect(expr.getMessage()).toBe("");

    const node: ChemNode = expr.getAgents()[0]!.nodes[0]!;
    expect(makeTextFormula(node)).toBe("NH4^+");

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 80);

    const res = buildNode(node, imgProps);
    expect(res).toBeDefined();
    const { nodeFrame } = res as ResultBuildNode;
    expect(nodeFrame.figures).toHaveLength(3);
    const [f1, f2, f3] = nodeFrame.figures as [FigFrame, FigFrame, FigFrame];
    expect(f1).toBeInstanceOf(FigFrame);
    const n = f1.figures[0] as FigText;
    expect(n).toBeInstanceOf(FigText);
    expect(n.text).toBe("N");
    expect(n.style.fill).toBe("blue");

    expect(f2).toBeInstanceOf(FigFrame);
    expect(f3).toBeInstanceOf(FigFrame);

    const root = new FigFrame();
    root.addFigure(nodeFrame);
    root.update();
    const { bounds } = root;
    const segs: PathSeg[] = [
      { cmd: "M", rel: false, pt: new Point(bounds.A.x, 0) },
      { cmd: "H", rel: false, x: bounds.B.x },
      { cmd: "M", rel: false, pt: new Point(0, bounds.A.y) },
      { cmd: "V", rel: false, y: bounds.B.y },
    ];
    root.addFigure(new FigPath(segs, { stroke: "magenta", strokeWidth: 0.5 }));

    saveSurface("buildNode_Ammonium", root, surface);
  });
});
