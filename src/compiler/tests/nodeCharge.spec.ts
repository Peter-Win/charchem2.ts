import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { ChemExpr } from "../../core/ChemExpr";
import { ChemNode } from "../../core/ChemNode";

const getNodes = (expr: ChemExpr): ChemNode[] => 
  expr.walkExt({
    nodes: [] as ChemNode[],
    nodePre(obj) {
      this.nodes.push(obj);
    },
  }).nodes

describe("NodeCharge", () => {
  it("PotassiumFerrate", () => {
    //    +- 2 O    -+ 2-
    //    |  1 ||    |
    // K+.|....Fe....|..K+
    // 0  |  //||\\  |  6
    //    | O   O  O |
    //    +-3   5  4-+
    const expr = compile(
      "$ver(1.0)K^+_(x2,N0)[Fe<_(A-90,S:|)O><_(A150,S|:)O><_(A15,S|:)O><_(A70,S|:)O>]^2-_(x2,N0,T0)K^+"
    );
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const bonds = Array.from(agent.bonds);
    expect(
      bonds.map((it) => `${it.nodes[0]?.index}:${it.nodes[1]?.index}`)
    ).toEqual(["0:1", "1:2", "1:3", "1:4", "1:5", "1:6"]);
    expect(agent.nodes.map((it) => makeTextFormula(makeBrutto(it)))).toEqual([
      "K+",
      "Fe",
      "O",
      "O",
      "O",
      "O",
      "K+",
    ]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("FeK2O4");
  });
  it("Use left", () => {
    const expr = compile("H`^+");
    expect(expr.getMessage()).toBe("");
    const nodes = getNodes(expr);
    expect(nodes.length).toBe(1);
    const node = nodes[0]!;
    expect(node.charge).toBeDefined();
    expect(node.charge!.isLeft).toBe(true);
    expect(node.charge!.pos).toBe("LT");
    expect(makeTextFormula(node)).toBe("+H");
  });
  it("Left bottom", () => {
    const expr = compile("H$pos(LB)^+");
    expect(expr.getMessage()).toBe("");
    const nodes = getNodes(expr);
    expect(nodes.length).toBe(1);
    const node = nodes[0]!;
    expect(node.charge).toBeDefined();
    expect(node.charge!.isLeft).toBe(true);
    expect(node.charge!.pos).toBe("LB");
    expect(makeTextFormula(node)).toBe("+H");
  })
  it("Using angle in left side", () => {
    const expr = compile("H$pos(150)^+");
    expect(expr.getMessage()).toBe("");
    const nodes = getNodes(expr);
    expect(nodes.length).toBe(1);
    const node = nodes[0]!;
    expect(node.charge).toBeDefined();
    expect(node.charge!.isLeft).toBe(true);
    expect(node.charge!.pos).toBe(150);
    expect(makeTextFormula(node)).toBe("+H");
  })
});
