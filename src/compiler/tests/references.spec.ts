import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { ChemBond } from "../../core/ChemBond";

describe("References", () => {
  it("Space", () => {
    const expr = compile("H3C# -CH2#\n -OH");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("H3C-CH2-OH");
  });
  it("RefByDirectIndex", () => {
    const expr = compile("H-C-H; H|#2|H");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("CH4");
    const agent = expr.getAgents()[0]!;
    const nodeC = agent.nodes[1]!;
    expect(makeTextFormula(nodeC)).toBe("C");
    expect(Array.from(nodeC.bonds)).toHaveLength(4);
  });
  it("RefByReverseIndex", () => {
    const expr = compile("H-N-H; H|#-3");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("H3N");
    const agent = expr.getAgents()[0]!;
    const nodeN = agent.nodes[1]!;
    expect(makeTextFormula(nodeN)).toBe("N");
    expect(Array.from(nodeN.bonds)).toHaveLength(3);
  });
  it("RefByName", () => {
    const expr = compile("Cl-C:center-Cl; O||#center");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("CCl2O");
    const agent = expr.getAgents()[0]!;
    const nodeC = agent.nodes[1]!;
    expect(makeTextFormula(nodeC)).toBe("C");
    expect(Array.from(nodeC.bonds)).toHaveLength(3);
  });
  it("RefByFirstAtomName", () => {
    // 0 1 2  3 4 5  6       7
    // H-C-H; H-C-H; H|#C|#5|H
    const expr = compile("H-C-H; H-C-H; H|#C|#5|H");
    expect(expr.getMessage()).toBe("");
    const bondDef = (bond: ChemBond): string =>
      `${bond.nodes[0]?.index}${bond.linearText()}${bond.nodes[1]?.index}`;
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(bondDef(bonds[0]!)).toBe("0-1");
    expect(bondDef(bonds[1]!)).toBe("1-2");
    expect(bondDef(bonds[2]!)).toBe("3-4");
    expect(bondDef(bonds[3]!)).toBe("4-5");
    expect(bondDef(bonds[4]!)).toBe("6|1");
    expect(bondDef(bonds[5]!)).toBe("1|4");
    expect(bondDef(bonds[6]!)).toBe("4|7");
  });
  it("InvalidNumberReference", () => {
    const expr = compile("H-N-H; H|#5");
    expect(expr.getMessage("ru")).toBe(
      "Неправильная ссылка на узел '5' в позиции 11"
    );
  });
  it("ZeroReference", () => {
    const expr = compile("H-N-H; H|#0");
    expect(expr.getMessage("ru")).toBe(
      "Неправильная ссылка на узел '0' в позиции 11"
    );
  });
  it("InvalidLabelReference", () => {
    const expr = compile("H-N-H; H|#abc");
    expect(expr.getMessage("ru")).toBe(
      "Неправильная ссылка на узел 'abc' в позиции 11"
    );
  });
  it("InvalidLabel", () => {
    const expr = compile("H-N:2-H; H|#2");
    expect(expr.getMessage("ru")).toBe("Неправильная метка в позиции 5");
  });
});
