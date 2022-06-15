import { ChemBond } from "../ChemBond";
import { Point } from "../../math/Point";
import { ChemNode } from "../ChemNode";

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
});
