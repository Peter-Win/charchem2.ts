import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";

describe("Macro", () => {
  it("Macro", () => {
    //      CH3
    //      |
    //      B
    //    /   \
    // H3C     CH3
    const expr = compile(
      "B@:ray(a,m:CH3)<_(A&a)&m>@(-90)@ray(30)@ray(150,H3C)"
    );
    expect(expr.getMessage()).toBe("");
    expect(expr.src).toBe("B<_(A-90)CH3><_(A30)CH3><_(A150)H3C> ");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes.map((it) => makeTextFormula(it))).toEqual([
      "B",
      "CH3",
      "CH3",
      "H3C",
    ]);
    expect(
      agent.bonds.map((it) => Math.round(it.dir!.polarAngleDeg()))
    ).toEqual([-90, 30, 150]);
  });
});
