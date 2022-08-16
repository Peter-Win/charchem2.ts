import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { compile } from "../../../compiler/compile";
import { createTestImgProps, createTestSurface } from "../../tests/testEnv";
import { doubleBond } from "../doubleBond";
import { Point } from "../../../math/Point";
import { FigPath } from "../../../drawSys/figures/FigPath";
import { PathSegPt } from "../../../drawSys/path";

describe("doubleBond", () => {
  it("Simple cross", () => {
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const expr = compile("C==xO");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds).toHaveLength(1);
    const bond = agent.bonds[0]!;
    expect(bond.n).toBe(2);
    expect(bond.align).toBe("x");

    imgProps.line = 100;
    imgProps.lineSpace2x = 20;
    imgProps.lineWidth = 4;
    const frame = new FigFrame();
    const { line } = imgProps;
    const p0 = bond.nodes[0]!.pt.times(line);
    const p1 = bond.nodes[1]!.pt.times(line);
    expect(String(p0)).toBe(String(Point.zero));
    expect(String(p1)).toBe(String(new Point(100, 0)));
    doubleBond({
      bond,
      frame,
      imgProps,
      p0,
      p1,
      styles: [],
      color: "black",
      align: bond.align,
      stA: agent.stA,
    });
    expect(frame.figures).toHaveLength(2);
    const f1 = frame.figures[0] as FigPath;
    const f2 = frame.figures[1] as FigPath;
    expect(f1).toBeInstanceOf(FigPath);
    expect(f2).toBeInstanceOf(FigPath);
    const dy = (imgProps.lineSpace2x + imgProps.lineWidth) / 2;
    const aL = String(new Point(0, -dy));
    const aR = String(new Point(0, dy));
    const bL = String(new Point(100, -dy));
    const bR = String(new Point(100, dy));
    expect(f1.segs).toHaveLength(2);
    expect(f1.segs[0]!.cmd).toBe("M");
    expect((f1.segs[0] as PathSegPt).pt.toString()).toBe(aL);
    expect(f1.segs[1]!.cmd).toBe("L");
    expect((f1.segs[1] as PathSegPt).pt.toString()).toBe(bR);
    expect(f2.segs).toHaveLength(2);
    expect(f2.segs[0]!.cmd).toBe("M");
    expect((f2.segs[0] as PathSegPt).pt.toString()).toBe(aR);
    expect(f2.segs[1]!.cmd).toBe("L");
    expect((f2.segs[1] as PathSegPt).pt.toString()).toBe(bL);
  });
});
