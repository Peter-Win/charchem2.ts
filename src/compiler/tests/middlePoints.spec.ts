import { compile } from "../compile";
import { ChemBond } from "../../core/ChemBond";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { ChemError } from "../../core/ChemError";

const bondNodes = (bond: ChemBond) =>
  bond.nodes.map((it) => (it?.index ?? -1) + 1);

describe("MiddlePoints", () => {
  it("Simple", () => {
    const expr = compile("H2C`|H2C`|H2C_m(x2)_m(y2)_(x-2)");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C3H6");
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(bondNodes(bonds[0]!)).toEqual([1, 2]);
    expect(bondNodes(bonds[1]!)).toEqual([2, 3]);
    expect(bondNodes(bonds[2]!)).toEqual([3, 1]);
  });
  it("InvalidMidpointBeforeNode", () => {
    const expr = compile("|_m(x1)_m(y-1)C");
    expect(expr.getMessage("en")).toBe("Invalid middle point");
    const { params } = expr.error! as ChemError;
    expect(params?.pos).toBe(2);
  });
  it("InvalidMidpointInTheEndOfAgent", () => {
    const expr = compile("||_m(x1)_m(y-1)");
    expect(expr.getMessage("en")).toBe("Invalid middle point");
    const { params } = expr.error! as ChemError;
    expect(params?.pos).toBe(3);
  });
  it("NotMergeBondWithMiddlePoints", () => {
    //   ---1<--
    // 2/   |0   \1
    //  \   v    /
    //   -->2---
    const expr = compile("|_m(x1)_m(y-1)`-_m(x-1)_m(y1)-");
    expect(expr.getMessage()).toBe("");
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(bonds).toHaveLength(3);
    expect(bondNodes(bonds[0]!)).toEqual([1, 2]);
    expect(bondNodes(bonds[1]!)).toEqual([2, 1]);
    expect(bondNodes(bonds[2]!)).toEqual([1, 2]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C2H2");
  });
  it("_m without (", () => {
    const expr = compile("|_m");
    expect(expr.getMessage("en")).toBe("Expected '(' after _m");
  });
});
