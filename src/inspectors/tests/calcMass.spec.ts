import { PeriodicTable } from "../../core/PeriodicTable";
import { compile } from "../../compiler/compile";
import { ChemAgent } from "../../core/ChemAgent";
import { ChemNode } from "../../core/ChemNode";
import { ChemNodeItem } from "../../core/ChemNodeItem";
import { calcMass } from "../calcMass";

describe("CalcMass", () => {
  it("Atom", () => {
    const massLi = PeriodicTable.dict.Li.mass;
    const expr = compile("Li");
    expect(expr.getMessage()).toBe("");
    const agent: ChemAgent = expr.getAgents()[0]!;
    const node: ChemNode = agent.nodes[0]!;
    const item: ChemNodeItem = node.items[0]!;
    expect(calcMass(item)).toBe(massLi);
    expect(calcMass(node)).toBe(massLi);
    expect(calcMass(agent)).toBe(massLi);
    expect(calcMass(expr)).toBe(massLi);
  });
  it("Coeff", () => {
    const { dict } = PeriodicTable;
    const massH = dict.H.mass;
    const massO = dict.O.mass;
    const massH2O = massH * 2 + massO;
    const expr = compile("5H2O ");
    expect(expr.getMessage()).toBe("");
    const agent: ChemAgent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(1);
    const node = agent.nodes[0]!;
    expect(node.items[0]!.obj).toBe(dict.H);
    expect(node.items).toHaveLength(2);
    const [item1, item2] = node.items;
    expect(calcMass(item2!)).toBe(massO);
    expect(calcMass(item1!)).toBe(massH * 2.0);
    expect(calcMass(node)).toBe(massH2O);
    expect(calcMass(agent)).toBe(5.0 * massH2O);
    expect(calcMass(agent, false)).toBe(massH2O);
    expect(calcMass(expr)).toBe(5.0 * massH2O);
    expect(calcMass(expr, false)).toBe(massH2O);
    expect(expr.mass()[0]).toBe(5.0 * massH2O);
    expect(expr.mass(false)[0]).toBe(massH2O);
  });
  it("Radical", () => {
    const expr = compile("Me2O");
    expect(expr.getMessage()).toBe("");
    const { dict } = PeriodicTable;
    const massH = dict.H.mass;
    const massC = dict.C.mass;
    const massO = dict.O.mass;
    const massMe = massH * 3 + massC;
    expect(calcMass(expr)).toBe(2 * massMe + massO);
  });
  it("MultiAgent", () => {
    const expr = compile("2H2 + O2 = 2H2O");
    expect(expr.getMessage()).toBe("");
    const agents = expr.getAgents();
    expect(agents).toHaveLength(3);
    expect(agents[0]!.n.num).toBe(2.0);
    expect(agents[1]!.n.num).toBe(1.0);
    expect(agents[2]!.n.num).toBe(2.0);
    const { dict } = PeriodicTable;
    const massH = dict.H.mass;
    const massO = dict.O.mass;
    const massH2O = 2 * massH + massO;
    const massTotal = calcMass(expr);
    const massList = expr.mass();
    expect(massList).toEqual([4 * massH, 2 * massO, 2 * massH2O]);
    expect(massTotal).toBe(massList.reduce((sum, n) => sum + n, 0));

    expect(calcMass(expr, false)).toBe(4.0 * massH + 2.0 * massO + massO);
    expect(expr.mass(false)).toEqual([2 * massH, 2 * massO, massH2O]);
  });
});
