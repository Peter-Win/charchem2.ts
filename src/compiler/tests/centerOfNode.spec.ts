import { ChemNode } from "../../core/ChemNode";
import { ChemExpr } from "../../core/ChemExpr";
import { textFormula } from "../../textBuilder/textFormula";
import { compile } from "../compile";

const getNode = (expr: ChemExpr): ChemNode => expr.getAgents()[0]!.nodes[0]!;

const getCenterItemText = (expr: ChemExpr): string =>
  textFormula(getNode(expr).getCenterItem()!, "text");

describe("Center of node", () => {
  it("SingleItem", () => {
    const expr = compile("Mg");
    expect(expr.getMessage()).toBe("");
    expect(getCenterItemText(expr)).toBe("Mg");
  });
  it("HydrogenAndDefault", () => {
    const expr = compile("HO3S");
    expect(expr.getMessage()).toBe("");
    expect(getCenterItemText(expr)).toBe("O3");
  });
  it("WithCarbon", () => {
    const expr = compile("HOC2C3");
    expect(expr.getMessage()).toBe("");
    expect(getCenterItemText(expr)).toBe("C2");
  });
  it("WithExplicit", () => {
    const expr = compile("HOC2`C3");
    expect(expr.getMessage()).toBe("");
    expect(getCenterItemText(expr)).toBe("C3");
  });
  it("WithRadical", () => {
    const expr = compile("HEtOH");
    expect(expr.getMessage()).toBe("");
    expect(getCenterItemText(expr)).toBe("Et");
  });
  it("WithAbstract", () => {
    const expr = compile("H{R}O");
    expect(expr.getMessage()).toBe("");
    expect(getCenterItemText(expr)).toBe("O");
  });
  it("CommentAndAbstract", () => {
    const expr1 = compile('{R}"|v"');
    expect(expr1.getMessage()).toBe("");
    expect(getCenterItemText(expr1)).toBe("R");

    const expr2 = compile('"|v"{R}');
    expect(expr2.getMessage()).toBe("");
    expect(getCenterItemText(expr2)).toBe("R");

    const expr3 = compile('{R}`"|v"');
    expect(expr3.getMessage()).toBe("");
    expect(getCenterItemText(expr3)).toBe("↓");
  });
  it("AutoNode", () => {
    const expr = compile("/\\");
    expect(expr.getMessage()).toBe("");
    expect(getCenterItemText(expr)).toBe("C");
  });
});
