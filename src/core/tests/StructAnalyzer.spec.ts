import { Point } from "../../math/Point";
import { compile } from "../../compiler/compile";
import {
  bondSideSign,
  calcBondSign,
  Cycle,
  getCycleCenter,
} from "../StructAnalyzer";

const cyNodes = (cy: Cycle): number[] => cy.nodes.map((node) => node.index);

describe("StructAnalyzer", () => {
  it("No cycles", () => {
    const expr = compile("H-C<`|H><|H>-C<`|H><|H>-H");
    expect(expr.getMessage()).toBe("");
    const { stA } = expr.getAgents()[0]!;
    stA.analyze();
    expect(stA.cycles.length).toBe(0);
  });
  it("Single cycle with even nodes", () => {
    //   nodes     bonds
    //    0---1     -0-
    //   4/   \2  4/   \1
    //     \3/     3\ /2
    const expr = compile("-_p_p_p_p");
    expect(expr.getMessage()).toBe("");
    const { stA } = expr.getAgents()[0]!;
    stA.analyze();
    expect(stA.cycles.length).toBe(1);
    expect(stA.cycles[0]?.nodes.map((n) => n.index)).toEqual([0, 1, 2, 3, 4]);
    expect(stA.cycles[0]?.bonds.map((b) => b.index)).toEqual([0, 1, 2, 3, 4]);
  });
  it("Single cycle with odd nodes", () => {
    //      OH 3       OH        OH
    //  0   |2      0  |2     0  |2
    // HO\1/ \4   HO\1/ \3  HO\1/ \2
    //    |   |     7|   |4   1|   |3
    //    7\ /5      6\ /5     2\ /3
    //      6
    //    nodes      bonds    bond orders
    const expr = compile("HO\\/<`|OH>\\|`/`\\`|");
    expect(expr.getMessage()).toBe("");
    const { stA } = expr.getAgents()[0]!;
    stA.analyze();
    // console.log("nodes", stA.cycles[0]?.nodes.map(n => n.index));
    // console.log("bonds", stA.cycles[0]?.bonds.map(b => b.index));
    expect(stA.cycles.length).toBe(1);
    expect(stA.cycles[0]?.bonds.map((b) => b.index)).toEqual([
      1, 3, 4, 5, 6, 7,
    ]);
    expect(stA.cycles[0]?.nodes.map((n) => n.index)).toEqual([
      1, 2, 4, 5, 6, 7,
    ]);
  });
  it("4 cycles", () => {
    // nodes      bonds
    // 0---1---2  +-0-+-1-+
    // |   |   |  |6  |4  |2
    // 5---4---3  +-5-+-3-+
    // |   |   |  |7  |9  |11
    // 6---7---8  +-8-+-A-+
    const expr = compile("-c-|`-<`|>`-<`|>|-<`|>-`|");
    expect(expr.getMessage()).toBe("");
    const { stA } = expr.getAgents()[0]!;
    stA.analyze();
    // stA.cycles.forEach((c, i) => {
    //     console.log(i,") nodes:", c.nodes.map(n => n.index).join(", "), ", bonds:", c.bonds.map(b=>b.index).join(", "))
    // })
    expect(stA.cycles.length).toBe(4);
    expect(cyNodes(stA.cycles[0]!)).toEqual([0, 1, 4, 5]);
    expect(cyNodes(stA.cycles[1]!)).toEqual([1, 2, 3, 4]);
    expect(cyNodes(stA.cycles[2]!)).toEqual([4, 5, 6, 7]);
    expect(cyNodes(stA.cycles[3]!)).toEqual([3, 4, 7, 8]);
    const res3 = stA.findCyclesForBond(stA.agent.bonds[3]!);
    expect(res3.length).toBe(2);
    expect(cyNodes(res3[0]!)).toEqual([1, 2, 3, 4]);
    expect(cyNodes(res3[1]!)).toEqual([3, 4, 7, 8]);
    expect(String(getCycleCenter(stA.cycles[0]!))).toBe(
      String(new Point(0.5, 0.5))
    );
    expect(String(getCycleCenter(stA.cycles[1]!))).toBe(
      String(new Point(1.5, 0.5))
    );
    expect(String(getCycleCenter(stA.cycles[2]!))).toBe(
      String(new Point(0.5, 1.5))
    );
    expect(String(getCycleCenter(stA.cycles[3]!))).toBe(
      String(new Point(1.5, 1.5))
    );
  });
  it("different chains", () => {
    //     2
    //    / \
    //   0---1  3---4
    //           \ /
    //            5
    const expr = compile("-_q3_q3; -_p3_p3");
    expect(expr.getMessage()).toBe("");
    const { stA } = expr.getAgents()[0]!;
    stA.analyze();
    expect(stA.cycles.length).toBe(2);
    expect(stA.cycles[0]?.nodes.map((n) => n.index)).toEqual([0, 1, 2]);
    expect(stA.cycles[1]?.nodes.map((n) => n.index)).toEqual([3, 4, 5]);
  });
  it("Auto align", () => {
    // bonds
    //  1__     __8
    // 2/ 0\_6_/7 \9
    // 3\__/5 1\__/10
    //    4   2 11
    const expr = compile("`\\`-`/\\-/-/-\\`/`-`\\");
    expect(expr.getMessage()).toBe("");
    const { stA } = expr.getAgents()[0]!;
    stA.analyze();
    expect(stA.cycles.length).toBe(2);
    expect(stA.cycles[0]?.bonds.map((n) => n.index)).toEqual([
      0, 1, 2, 3, 4, 5,
    ]);
    expect(stA.cycles[1]?.bonds.map((n) => n.index)).toEqual([
      7, 8, 9, 10, 11, 12,
    ]);
    const c1 = getCycleCenter(stA.cycles[0]!);
    const c2 = getCycleCenter(stA.cycles[1]!);
    expect(String(c1)).toBe(String(new Point(-1, 0)));
    expect(String(c2)).toBe(String(new Point(2, 0)));
    expect(calcBondSign(stA.cycles[0]!, stA.agent.bonds[1]!)).toBe(-1);
    expect(calcBondSign(stA.cycles[0]!, stA.agent.bonds[4]!)).toBe(-1);
    expect(calcBondSign(stA.cycles[1]!, stA.agent.bonds[8]!)).toBe(1);
    expect(calcBondSign(stA.cycles[1]!, stA.agent.bonds[11]!)).toBe(1);
  });
});

describe("bondSideSign", () => {
  it("non cycle", () => {
    //  |0  |3
    //  1\ /2\4
    //        |5
    //       /6
    const expr = compile("|\\/<`|>\\|`/");
    expect(expr.getMessage()).toBe("");
    const { bonds, stA } = expr.getAgents()[0]!;
    expect(bondSideSign(bonds[0]!, 0)).toBe(0); // no connection
    expect(bondSideSign(bonds[0]!, 1)).toBe(-1); // single connection to left
    expect(stA.calcBondSign(bonds[0]!)).toBe(-1);

    expect(bondSideSign(bonds[1]!, 0)).toBe(1);
    expect(bondSideSign(bonds[1]!, 1)).toBe(-1);
    expect(stA.calcBondSign(bonds[1]!)).toBe(-1);

    expect(bondSideSign(bonds[2]!, 0)).toBe(1);
    expect(bondSideSign(bonds[2]!, 1)).toBe(0);
    expect(stA.calcBondSign(bonds[2]!)).toBe(-1);

    expect(bondSideSign(bonds[3]!, 0)).toBe(0);
    expect(bondSideSign(bonds[3]!, 1)).toBe(0);
    expect(stA.calcBondSign(bonds[3]!)).toBe(0);

    expect(bondSideSign(bonds[4]!, 0)).toBe(0);
    expect(bondSideSign(bonds[4]!, 1)).toBe(1);
    expect(stA.calcBondSign(bonds[4]!)).toBe(1);

    expect(bondSideSign(bonds[5]!, 0)).toBe(-1);
    expect(bondSideSign(bonds[5]!, 1)).toBe(1);
    expect(stA.calcBondSign(bonds[5]!)).toBe(1);

    expect(bondSideSign(bonds[6]!, 0)).toBe(-1);
    expect(bondSideSign(bonds[6]!, 1)).toBe(0);
    expect(stA.calcBondSign(bonds[5]!)).toBe(1);
  });
});
