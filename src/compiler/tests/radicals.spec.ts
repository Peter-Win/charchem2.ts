import { compile } from "../compile";
import { textFormula } from "../../textBuilder/textFormula";
import { calcMass } from "../../inspectors/calcMass";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { isAbstract } from "../../inspectors/isAbstract";
import { PeriodicTable } from "../../core/PeriodicTable";
import { ChemObj } from "../../core/ChemObj";

const toText = (obj: ChemObj): string => textFormula(obj, "text");

describe("radicals", () => {
  it("Me", () => {
    const expr = compile("Me");
    expect(expr.getMessage()).toBe("");
    expect(toText(expr)).toBe("Me");
    const { dict } = PeriodicTable;
    expect(calcMass(expr)).toBe(dict.C.mass + dict.H.mass * 3);
  });
  it("Et2O", () => {
    const expr = compile("Et2O");
    expect(expr.getMessage()).toBe("");
    expect(toText(expr)).toBe("Et2O");
    const { dict } = PeriodicTable;
    const m = (dict.C.mass * 2 + dict.H.mass * 5) * 2 + dict.O.mass;
    expect(calcMass(expr)).toBe(m);
  });
  it("WithBrackets", () => {
    const expr = compile("{i-Bu}OH");
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(false);
    expect(toText(expr)).toBe("i-BuOH");
    const { dict } = PeriodicTable;
    const m = dict.C.mass * 4 + dict.H.mass * 10 + dict.O.mass;
    expect(calcMass(expr)).toBe(m);
  });
  it("AcetylCoA", () => {
    // https://en.wikipedia.org/wiki/Acetyl-CoA
    const expr = compile("{Ac}S{CoA}");
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("C23H38N7O17P3S");
    expect(toText(makeBrutto(compile("{CoA}SH")))).toBe("C21H36N7O16P3S");
  });
  it("sec-butyl", () => {
    const expr = compile("{sBu}-OH");
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(false);
    expect(toText(expr)).toBe("sBu-OH");
    const { dict } = PeriodicTable;
    const m = dict.C.mass * 4 + dict.H.mass * 10 + dict.O.mass;
    expect(calcMass(expr)).toBeCloseTo(m, 3);
  });
});
