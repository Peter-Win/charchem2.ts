import { compile } from "../compile";
import { toa } from "../../math";
import { ChemExpr } from "../../core/ChemExpr";
import { ChemBond } from "../../core/ChemBond";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";

const getBonds = (expr: ChemExpr): ChemBond[] =>
  Array.from(expr.getAgents()[0]!.bonds);

const makeBondsNAS = (expr: ChemExpr): string[] =>
  getBonds(expr).map((it) => `${toa(it.n)}${it.align ?? ""}${it.style}`);

describe("universalBondProps", () => {
  it("Multiplicity", () => {
    const expr = compile('_(A-60,N2m)_(A0,N2x)_(A60,N0)"(R)"');
    expect(expr.getMessage()).toBe("");
    expect(makeBondsNAS(expr)).toEqual(["2m", "2x", "0"]);
  });
  it("Styles", () => {
    const expr = compile(
      "_(A0,N1.5,S:|r)_(A90,N1.5,S:|r)_(A180,N1.5,S:|r)_(A-90,N1.5,S:|r)"
    );
    expect(expr.getMessage()).toBe("");
    expect(makeBondsNAS(expr)).toEqual([
      "1.5r:|",
      "1.5r:|",
      "1.5r:|",
      "1.5r:|",
    ]);
    expect(makeTextFormula(makeBrutto(expr))).toBe("C4H4");
  });
  it("Width", () => {
    //  0        w-3==4        D+7||8        D-11--
    //   \      /      \      /      \      /
    //    W+1==2        W-5--6        d+9||10
    const expr = compile(
      "_(A60,W+)_(A0)_(A-60,w-)_(A0)_(A60,W-)_(A0)_(A-60,D+)_(A0)_(A60,d+)_(A0)_(A-60,D-)_(A0)"
    );
    expect(expr.getMessage()).toBe("");
    expect(getBonds(expr).map((it) => `${it.w0},${it.w1}`)).toEqual([
      "0,1",
      "1,1",
      "1,0",
      "1,1",
      "1,0",
      "0,0",
      "0,-1",
      "-1,-1",
      "0,-1",
      "-1,-1",
      "-1,0",
      "0,0",
    ]);
  });
  it("Coordinate Bonds", () => {
    const expr = compile("_(A60,C-)_(A0,C+)_(A-60,C)_(A0)_(A60,<)_(A0,>)");
    expect(expr.getMessage()).toBe("");
    const bonds = getBonds(expr).map(
      (it) => `${it.arr0 ? "<" : ""}-${it.arr1 ? ">" : ""}`
    );
    expect(bonds).toEqual(["<-", "<->", "->", "-", "<-", "->"]);
  });
  it("HydrogenBond", () => {
    const expr = compile("O_(A30,L2,H)H_(A-30,L2,~)N");
    expect(expr.getMessage()).toBe("");
    expect(getBonds(expr).map((it) => it.style)).toEqual([":", "~"]);
  });
  it("CustomSoftBond", () => {
    const expr = compile("CH3_(A10,h)CH2");
    expect(expr.getMessage()).toBe("");
    const bond = getBonds(expr)[0]!;
    expect(bond.soft).toBe(true);
    expect(Math.round(bond.dir!.polarAngleDeg())).toBe(10);
    expect(Math.round(bond.dir!.length() * 100)).toBe(100);
  });
  it("CustomText", () => {
    const expr = compile("H3N_(x2,>,T-->)Pt");
    expect(expr.getMessage()).toBe("");
    const bond = getBonds(expr)[0]!;
    expect(bond.tx).toBe("-->");
  });
  it("Specified width", () => {
    const expr = compile("_(A90,w0)_(A0,w1)_(A-90,w2)")
    expect(expr.getMessage()).toBe("");
    const {bonds} = expr.getAgents()[0]!
    expect(bonds.map(b => `${b.w0},${b.w1}`)).toEqual(["0,0", "0,0", "1,1"]);
  })
});
