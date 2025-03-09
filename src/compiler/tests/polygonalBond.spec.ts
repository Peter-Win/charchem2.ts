import { compile } from "../compile";
import { textFormula } from "../../textBuilder/textFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { ChemObj } from "../../core/ChemObj";

const brutto = (obj: ChemObj): string => textFormula(makeBrutto(obj), "text");

describe("PolygonalBond", () => {
  it("SimpleP", () => {
    //    _p+_p
    //    0===1
    // _p /     \ _p5
    // 4 O     2
    //  _p \3// _pp
    const expr = compile("_p_p5_pp_pO_p_p");
    // Последний сегмент накладывается на первый с образованием двойной связи
    expect(expr.getMessage()).toBe("");
    const agents = expr.getAgents()[0]!;
    const bonds = Array.from(agents.bonds);
    expect(bonds.map((it) => Math.round(it.dir!.polarAngleDeg()))).toEqual([
      0, 72, 144, -144, -72,
    ]);
    expect(bonds.map((it) => it.n)).toEqual([2.0, 1.0, 2.0, 1.0, 1.0]);
    expect(agents.nodes.map(brutto)).toEqual(["CH", "CH", "CH", "CH", "O"]);
    expect(brutto(expr)).toBe("C4H4O");
  });
  it("Q3", () => {
    const expr = compile("-_qq3_q3");
    expect(expr.getMessage()).toBe("");
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(bonds.map((it) => Math.round(it.dir!.polarAngleDeg()))).toEqual([
      0, -120, 120,
    ]);
    expect(bonds.map((it) => it.n)).toEqual([1.0, 2.0, 1.0]);
    expect(brutto(expr)).toBe("C3H4");
  });
  it("UsingLengthOfPreviousBond", () => {
    const expr = compile("_(x2)_p4");
    expect(expr.getMessage()).toBe("");
    expect(expr.getAgents()[0]!.nodes.map((it) => it.pt.toString())).toEqual([
      "(0, 0)",
      "(2, 0)",
      "(2, 2)",
    ]);
  });
  it("SuffixesWD", () => {
    const expr = compile("-_p6w_p6ww_p6_p6d_p6dd");
    expect(expr.getMessage()).toBe("");
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(bonds.map((it) => `${it.w0},${it.w1}`)).toEqual([
      "0,0",
      "0,1",
      "1,0",
      "0,0",
      "0,-1",
      "-1,0",
    ]);
    expect(brutto(expr)).toBe("C6H12");
  });
  it("ZeroBond", () => {
    const expr = compile("-_p4o_p4_pp4");
    expect(expr.getMessage()).toBe("");
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(bonds.map((it) => it.n)).toEqual([1.0, 0.0, 1.0, 2.0]);
  });
});
