import { compile } from "../compile";
import { isAbstract } from "../../inspectors/isAbstract";
import { calcMass } from "../../inspectors/calcMass";
import { PeriodicTable } from "../../core/PeriodicTable";
import { ChemError } from "../../core/ChemError";
import { textFormula } from "../../textBuilder/textFormula";
import { Lang } from "../../lang/Lang";

describe("Comment", () => {
  it("Comment End Simple", () => {
    const expr = compile('C"(solid)"');
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(false);
    expect(calcMass(expr)).toBe(PeriodicTable.dict.C.mass);
    expect(textFormula(expr, "text")).toBe("C(solid)");
    expect(textFormula(expr, "htmlPoor")).toBe("C<em>(solid)</em>");
  });
  it("Comment With Translation", () => {
    const oldLang = Lang.curLang;
    Lang.curLang = "ru";
    const expr = compile('NaCl"`(aq)`"');
    Lang.curLang = oldLang;
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(false);
    expect(textFormula(expr, "htmlPoor")).toBe("NaCl<em>(р-р)</em>");
    expect(calcMass(expr)).toBe(
      PeriodicTable.dict.Na.mass + PeriodicTable.dict.Cl.mass
    );
  });
  it("CommentWithSpecial", () => {
    const expr = compile('S"|v"');
    expect(expr.getMessage()).toBe("");
    expect(textFormula(expr, "text")).toBe("S↓");
    expect(calcMass(expr)).toBe(PeriodicTable.dict.S.mass);
  });
  it("CommentWithGreek", () => {
    const expr = compile('Ar"[Theta][psi]"');
    expect(expr.getMessage()).toBe("");
    expect(textFormula(expr, "text")).toBe("ArΘψ");
    expect(calcMass(expr)).toBe(PeriodicTable.dict.Ar.mass);
  });
  it("BeforeAgent", () => {
    const expr = compile('"|^"F2');
    expect(expr.getMessage()).toBe("");
    expect(textFormula(expr, "text")).toBe("↑F2");
    expect(calcMass(expr)).toBe(PeriodicTable.dict.F.mass * 2);
  });
  it("Error", () => {
    const expr = compile('Cu"123');
    expect(expr.getMessage("en")).toBe("Comment is not closed");
    const err = expr.error! as ChemError;
    const pos = err.params?.pos;
    expect(pos).toBe(3);
  });
});
