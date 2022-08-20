import { ChemBond } from "../ChemBond";
import { Point } from "../../math/Point";
import { ChemNode } from "../ChemNode";
import { compile } from "../../compiler/compile";

describe("ChemBond", () => {
  it("calcPt", () => {
    const bond = new ChemBond();
    bond.nodes[0] = new ChemNode(new Point(1.0, 2.0));
    bond.dir = new Point(2.0, 1.0);
    const p2: Point = bond.calcPt();
    expect(String(p2)).toBe("(3, 3)");
  });
  it("other", () => {
    const nodeA = new ChemNode(new Point(0.0, 0.0));
    const nodeB = new ChemNode(new Point(1.0, 1.0));
    const nodeC = new ChemNode(new Point(2.0, 2.0));
    const bond = new ChemBond();
    bond.nodes = [nodeA, nodeB];
    expect(bond.other(nodeA)).toBe(nodeB);
    expect(bond.other(nodeB)).toBe(nodeA);
    expect(bond.other(nodeC)).toBeUndefined();
  });

  const bondDir = (dir?: Point) => {
    const bond = new ChemBond();
    bond.dir = dir;
    bond.checkText();
    return bond;
  };
  it("checkText", () => {
    expect(bondDir().isText).toBe(false);
    expect(bondDir(new Point(1, 0)).isText).toBe(true);
    expect(bondDir(new Point(1.1, 0)).isText).toBe(false);
    expect(bondDir(new Point(-1, 0)).isText).toBe(true);
    expect(bondDir(new Point(0, 1)).isText).toBe(false);
  });
  it("isHorizontal", () => {
    expect(bondDir(new Point(1, 0)).isHorizontal()).toBe(true);
    expect(bondDir(new Point(2, 0)).isHorizontal()).toBe(true);
    expect(bondDir(new Point(-1, 0)).isHorizontal()).toBe(true);
    expect(bondDir(new Point(-2, 0)).isHorizontal()).toBe(true);
    expect(bondDir(new Point(1, 1)).isHorizontal()).toBe(false);
    expect(bondDir(new Point(0, 1)).isHorizontal()).toBe(false);
  });
  it("isVerticalConnection", () => {
    //  |  H2      H6
    // 0|  N       N      |10
    //  |/1  \3  /5  \7  /9
    //  O      N       v
    //         H4      H8
    const expr = compile(
      "|O/N<_(y-.5)H>\\N<_(y.5)H>/N$L(.5)<`|H>$L()\\<_(y.5)H>/_(y-.5)"
    );
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { bonds } = agent;
    expect(bonds.length).toBe(11);
    expect(bonds[0]!.isVerticalConnection()).toBe(false); // dx=0, but dy!=0.5 and first node is invisible
    expect(bonds[1]!.isVerticalConnection()).toBe(false); // dy=0.5 but dx!=0
    expect(bonds[2]!.isVerticalConnection()).toBe(true); // typical vertical connection upwards
    expect(bonds[3]!.isVerticalConnection()).toBe(false);
    expect(bonds[4]!.isVerticalConnection()).toBe(true); // typical vertical connection top down
    expect(bonds[5]!.isVerticalConnection()).toBe(false);
    expect(bonds[6]!.isVerticalConnection()).toBe(true); // vertical connection upwards with $L(0.5)
    expect(bonds[7]!.isVerticalConnection()).toBe(false);
    const bond8 = bonds[8]!;
    expect(bond8.nodes[0]);
    expect(bonds[8]!.isVerticalConnection()).toBe(false); // one node is invisible
    expect(bonds[10]!.isVerticalConnection()).toBe(false); // both nodes are invisible
  });
});
