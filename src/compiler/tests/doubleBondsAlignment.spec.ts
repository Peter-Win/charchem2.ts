import { compile } from "../compile";
import { ChemExpr } from "../../core/ChemExpr";
import { ChemBond } from "../../core/ChemBond";

const getBonds = (expr: ChemExpr): ChemBond[] =>
  Array.from(expr.getAgents()[0]!.bonds);

const getAligns = (expr: ChemExpr): string =>
  getBonds(expr).reduce((s, b) => s + (b.align ?? "."), "");

describe("DoubleBondAlignment", () => {
  it("UniversalWithN", () => {
    //     /1\\R
    //   0     2
    // L||     |
    //   5     3
    //     \4//M
    const expr = compile("/_(A30,N2r)|_(A150,N2m)`\\_(A-90,N2L)");
    expect(expr.getMessage()).toBe("");
    expect(getAligns(expr)).toBe(".r.m.l");
  });
  it("UniversalWithS", () => {
    const expr = compile("_(A30,S:|r)_(A90,S:|m)_(A30,S:|L)");
    expect(expr.getMessage()).toBe("");
    expect(getAligns(expr)).toBe("rml");
  });
  it("Function", () => {
    //  ===+   +===+===+   +===+
    //     | R | M   R | L |   ||
    //     +===+       +===+
    const expr = compile(
      "=|$dblAlign(r)=`|$dblAlign(M)_(A0,N2,T=)_(A0,N2R,T=)|$dblAlign(L)_qq4_q4$dblAlign()=_(a90,N2,T||)"
    );
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(1);
    expect(getBonds(expr).map((it) => it.linearText())).toEqual([
      "=",
      "|",
      "=",
      "`|",
      "=",
      "=",
      "|",
      "_qq4",
      "_q4",
      "=",
      "||",
    ]);
    expect(getAligns(expr)).toBe("..r.mr.l...");
  });
  it("Suffixes", () => {
    const expr = compile("=|=r`|=m=x=r|_qq4l_q4=||");
    expect(expr.getMessage()).toBe("");
    expect(getAligns(expr)).toBe("..r.m.r.l...");
  });
});
