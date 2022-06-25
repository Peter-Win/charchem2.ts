import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { calcMass } from "../../inspectors/calcMass";
import { PeriodicTable } from "../../core/PeriodicTable";
import { rulesHtml } from "../../textRules/rulesHtml";
import { isAbstract } from "../../inspectors/isAbstract";

describe("Item", () => {
  it("H", () => {
    const h = compile("H");
    expect(h.isOk()).toBe(true);
    expect(h.entities).toHaveLength(1);
    expect(makeTextFormula(h)).toBe("H");
    expect(calcMass(h)).toBe(PeriodicTable.dict.H.mass);
  });
  it("D", () => {
    const d = compile("D");
    expect(d.isOk()).toBe(true);
    expect(makeTextFormula(d)).toBe("D");
    expect(calcMass(d)).toBe(PeriodicTable.isotopesDict.D.mass);
  });
  it("Al", () => {
    const al = compile("Al");
    expect(al.isOk()).toBe(true);
    expect(makeTextFormula(al)).toBe("Al");
    expect(calcMass(al)).toBe(PeriodicTable.dict.Al.mass);
  });
  it("MgO", () => {
    const mgo = compile("MgO");
    expect(mgo.isOk()).toBe(true);
    expect(makeTextFormula(mgo)).toBe("MgO");
    expect(calcMass(mgo)).toBe(
      PeriodicTable.dict.Mg.mass + PeriodicTable.dict.O.mass
    );
  });
  it("Cl2", () => {
    const expr = compile("Cl2");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("Cl2");
    expect(calcMass(expr)).toBe(PeriodicTable.dict.Cl.mass * 2.0);
  });
  it("C2H5OH", () => {
    const expr = compile("C2H5OH");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      "C<sub>2</sub>H<sub>5</sub>OH"
    );
    const { dict } = PeriodicTable;
    expect(calcMass(expr)).toBe(
      dict.C.mass * 2 + dict.H.mass * 6 + dict.O.mass
    );
  });
  it("AbstractItemCoeff", () => {
    const expr = compile("C'n'H'2n+2'");
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(true);
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      "C<sub>n</sub>H<sub>2n+2</sub>"
    );
  });
  it("CustomItem", () => {
    const expr = compile("{R}OH");
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(true);
    expect(makeTextFormula(expr)).toBe("ROH");
  });
});
