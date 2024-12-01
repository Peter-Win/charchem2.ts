import { ChemNode } from "../../core/ChemNode";
import { ChemObj } from "../../core/ChemObj";
import { compile } from "../../compiler/compile";
import { makeBrutto } from "../makeBrutto";
import { makeTextFormula } from "../makeTextFormula";
import { calcMass } from "../calcMass";
import { calcCharge } from "../calcCharge";
import { rulesHtml } from "../../textRules/rulesHtml";
import { rulesCharChem } from "../../textRules/rulesCharChem";

const nodeCvt = (node: ChemNode): ChemObj =>
  node.autoMode ? makeBrutto(node) : node;

describe("makeBrutto", () => {
  it("SingleNode", () => {
    const src = compile("CH3CH2OH");
    expect(src.getMessage()).toBe("");
    const brutto = makeBrutto(src);
    expect(brutto.getMessage()).toBe("");
    expect(makeTextFormula(brutto)).toBe("C2H6O");
    expect(calcMass(src)).toBe(calcMass(brutto));
  });
  it("Charge", () => {
    const expr = compile("SO4^2-");
    expect(expr.getMessage()).toBe("");
    const brutto = makeBrutto(expr);
    expect(brutto.getMessage()).toBe("");
    expect(calcCharge(brutto)).toBe(-2.0);
    expect(makeTextFormula(brutto)).toBe("O4S^2-");
    expect(makeTextFormula(brutto, rulesHtml)).toBe(
      "O<sub>4</sub>S<sup>2-</sup>"
    );
  });
  it("Complex", () => {
    const expr = compile("[Fe(CN)6]^4-");
    expect(expr.getMessage()).toBe("");
    const brutto = makeBrutto(expr);
    expect(brutto.getMessage()).toBe("");
    const agent = brutto.getAgents()[0]!;
    const node = agent.nodes[0]!;
    expect(node.charge?.value).toBe(-4.0);
    expect(calcCharge(brutto)).toBe(-4.0);
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      "[Fe(CN)<sub>6</sub>]<sup>4-</sup>"
    );
    expect(makeTextFormula(brutto, rulesHtml)).toBe(
      "C<sub>6</sub>FeN<sub>6</sub><sup>4-</sup>"
    );
  });
  it("IgnoreOfEmptyNode", () => {
    const expr = compile("H3C-{}|{}-OH");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr), rulesCharChem)).toBe("CH4O");
  });
  it("Comments", () => {
    const expr = compile('//<`|0"(E)">\\');
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr), rulesCharChem)).toBe("C3H6");
    expect(
      expr
        .getAgents()[0]!
        .nodes.map((it) => makeTextFormula(nodeCvt(it), rulesCharChem))
    ).toEqual(["CH2", "CH", '"(E)"', "CH3"]);
  });
  it("Comments2", () => {
    const expr = compile(
      'N//`|`\\\\`/||\\$L(.6)|0"1"; $L(.4)#2\\0"2"; #3/0"3"; #4`|0"4"; #5`\\0"5"; #6`/0"6"'
    );
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds.map((it) => Math.round(it.n))).toEqual([
      2, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0,
    ]);
    expect(
      agent.nodes.map((it) => makeTextFormula(nodeCvt(it), rulesCharChem))
    ).toEqual([
      "N",
      "CH",
      "CH",
      "CH",
      "CH",
      "CH",
      '"1"',
      '"2"',
      '"3"',
      '"4"',
      '"5"',
      '"6"',
    ]);
    expect(makeTextFormula(makeBrutto(expr), rulesCharChem)).toBe("C5H5N");
  });
  it("ignoreAgentK", () => {
    const expr = compile("2H");
    expect(expr.getMessage()).toBe("");
    const bruttoNetto = makeBrutto(expr, true);
    expect(makeTextFormula(bruttoNetto)).toBe("H");
    const bruttoFull = makeBrutto(expr);
    expect(makeTextFormula(bruttoFull)).toBe("H2");
  });
});
