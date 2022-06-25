import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { Point, pointFromDeg } from "../../math/Point";

describe("UniversalBondCoord", () => {
  it("XY", () => {
    const expr = compile("_(x1)_(y-1)_(x-1,y1)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes.map((it) => String(it.pt))).toEqual([
      "(0, 0)",
      "(1, 0)",
      "(1, -1)",
    ]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C3H6");
  });
  it("AbsoluteAngle", () => {
    const expr = compile("_(A0)$L(2)_(A90)_(A180,L1)_(A-90)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes.map((it) => String(it.pt))).toEqual([
      "(0, 0)",
      "(1, 0)",
      "(1, 2)",
      "(0, 2)",
    ]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C4H8");
  });
  it("RelativeAngle", () => {
    const expr = compile("_(a45)O_(a90)_(a-90)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const a = new Point();
    const b = a.plus(pointFromDeg(45.0));
    const c = b.plus(pointFromDeg(135.0));
    const d = c.plus(pointFromDeg(45.0));
    expect(agent.nodes.map((it) => String(it.pt))).toEqual(
      [a, b, c, d].map((p) => String(p))
    );
    expect(makeTextFormula(makeBrutto(expr))).toBe("C3H8O");
  });
  it("DefaultPolygonal", () => {
    const expr = compile("_(P)_(P)_(P)_(P)_(P)");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C5H10");
    expect(
      expr
        .getAgents()[0]!
        .bonds.map((it) => Math.round(it.dir!.polarAngleDeg()))
    ).toEqual([0, 72, 144, -144, -72]);
  });
  it("NegativePolygonal", () => {
    const expr = compile("-_(P-4)_(P-4)_(P-4)");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C4H8");
    expect(expr.getAgents()[0]!.nodes.map((it) => String(it.pt))).toEqual([
      "(0, 0)",
      "(1, 0)",
      "(1, -1)",
      "(0, -1)",
    ]);
  });
  it("ReferencesList", () => {
    //   \
    //     \
    //  |  /
    //  |/
    const expr = compile("_(x1,y1)_(x-1,y1)_(p1;-1)");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C4H10");
    expect(expr.getAgents()[0]!.nodes.map((it) => String(it.pt))).toEqual([
      "(0, 0)",
      "(1, 1)",
      "(0, 2)",
      "(0, 1)",
    ]);
  });
  it("EmptyRefList", () => {
    const expr = compile("_(p)");
    expect(expr.getMessage("ru")).toBe(
      "Неправильная ссылка на узел '' в позиции 4"
    );
  });
  it("InvalidRef", () => {
    const expr = compile("_(p22)");
    expect(expr.getMessage("ru")).toBe(
      "Неправильная ссылка на узел '22' в позиции 4"
    );
  });
  it("WithoutParams", () => {
    const expr = compile("-|_#1");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(3);
    expect(agent.bonds).toHaveLength(3);
    expect(agent.bonds[2]!.dir!.toString()).toBe("(-1, -1)");
    expect(agent.bonds[2]!.nodes[1]).toBe(agent.nodes[0]);
  });
  it("UsingReferencesInXYParams", () => {
    const expr = compile("-|_(x#1)_(y#1)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds).toHaveLength(4);
    expect(agent.nodes.map((it) => String(it.pt))).toEqual([
      "(0, 0)",
      "(1, 0)",
      "(1, 1)",
      "(0, 1)",
    ]);
  });
  it("UsingRefsListInXY", () => {
    const expr = compile("-_(x#1;-1,y1)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds).toHaveLength(2);
    expect(agent.nodes.map((it) => String(it.pt))).toEqual([
      "(0, 0)",
      "(1, 0)",
      "(0.5, 1)",
    ]);
  });
  it("InvalidRefsListInXY", () => {
    const expr = compile("-_(x#1;-11,y1)");
    expect(expr.getMessage("ru")).toBe(
      "Неправильная ссылка на узел '-11' в позиции 8"
    );
  });
});
