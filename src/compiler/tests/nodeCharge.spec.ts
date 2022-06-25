import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";

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
});
