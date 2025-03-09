import { compile } from "../compile";
import { calcMass } from "../../inspectors/calcMass";
import { textFormula } from "../../textBuilder/textFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { PeriodicTable } from "../../core/PeriodicTable";
import { ChemObj } from "../../core/ChemObj";

const toText = (obj: ChemObj): string => textFormula(obj, "text");

describe("SimpleBond", () => {
  it("Simple", () => {
    const expr = compile("H3C-CH3");
    expect(expr.getMessage()).toBe("");
    const { dict } = PeriodicTable;
    expect(calcMass(expr)).toBe(dict.C.mass * 2 + dict.H.mass * 6);
    expect(expr.entities).toHaveLength(1);
    const agents = expr.getAgents()!;
    expect(agents).toHaveLength(1);
    const agent = agents[0]!;
    expect(agent.nodes).toHaveLength(2);
    const [node0, node1] = agent.nodes;
    expect(toText(node0!)).toBe("H3C");
    expect(toText(node1!)).toBe("CH3");
    expect(node0!.bonds.size).toBe(1);
    expect(node1!.bonds.size).toBe(1);

    expect(agent.bonds).toHaveLength(1);
    const bond = agent.bonds[0]!;
    expect(bond.nodes).toHaveLength(2);
    expect(bond.nodes[0]!).toBe(node0);
    expect(bond.nodes[1]!).toBe(node1);
    expect(bond.soft).toBe(true);

    expect(toText(expr)).toBe("H3C-CH3");
  });
  it("AutoNodes", () => {
    const expr = compile(`//\\`); // propen = C3H6
    expect(expr.getMessage()).toBe("");
    expect(toText(expr)).toBe(`//\\`);
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    expect(agent.nodes).toHaveLength(3);
    expect(agent.bonds).toHaveLength(2);
    const { dict } = PeriodicTable;
    expect(calcMass(expr)).toBe(dict.C.mass * 3 + dict.H.mass * 6);
    expect(toText(makeBrutto(expr))).toBe("C3H6");
    expect(agent.bonds[0]!.soft).toBe(false);
    expect(agent.bonds[1]!.soft).toBe(false);
  });
  it("SoftCorrection", () => {
    const expr = compile("-"); // Ethane, C2H6
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("C2H6");
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    expect(agent.bonds).toHaveLength(1);
    const bond = agent.bonds[0]!;
    expect(bond.tx).toBe("-");
    expect(bond.soft).toBe(false);
    expect(String(bond.dir)).toBe("(1, 0)");
  });
  it("Cycle", () => {
    const expr = compile("-|`-`|"); // Cyclobutane C4H8
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    expect(agent.nodes).toHaveLength(4);
    expect(agent.bonds).toHaveLength(4);
    expect(String(agent.nodes[0]!.pt)).toBe("(0, 0)");
    expect(String(agent.nodes[1]!.pt)).toBe("(1, 0)");
    expect(String(agent.nodes[2]!.pt)).toBe("(1, 1)");
    expect(String(agent.nodes[3]!.pt)).toBe("(0, 1)");
    expect(toText(makeBrutto(expr))).toBe("C4H8");
  });
  it("CycleWithSoftEnd", () => {
    const expr = compile("|`-`|-"); // last soft bond transformed into hard
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("C4H8");
  });
  it("ContinuationCycle", () => {
    // 4---0---3
    //     |   |
    //     1---2
    const expr = compile("|-`|`-`-");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    expect(agent.nodes).toHaveLength(5);
    expect(String(agent.nodes[4]!.pt)).toBe("(-1, 0)");
  });
  it("BondMerging", () => {
    // 0===1
    // |   |
    // 3---2
    const expr = compile("-|`-`|-");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(4);
    expect(agent.bonds).toHaveLength(4);
    expect(agent.bonds[0]!.n).toBe(2.0);
  });
  it("BondMergingWithDifferentDirection", () => {
    // 0===1<--4
    //     |   |
    //     2-->3
    const expr = compile("-|-`|`-`-");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(5);
    expect(agent.bonds).toHaveLength(5);
    expect(agent.bonds[0]!.n).toBe(2.0);
    expect(
      Array.from(agent.nodes[0]!.bonds).map((it) => it.debugText())
    ).toEqual(["0(0*2)1"]);
    expect(
      Array.from(agent.nodes[1]!.bonds).map((it) => it.debugText())
    ).toEqual(["0(0*2)1", "1(90)2", "4(180)1"]);
  });
  it("ChainBreak", () => {
    const expr = compile("H3C; OH");
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("CH4O");
  });
  it("Azetidine", () => {
    const expr = compile("NH`|`-|-");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(
      agent.bonds.map((it) => `${it.linearText()}${it.soft ? "*" : ""}`)
    ).toEqual(["`|", "`-", "|", "-"]);
    expect(agent.nodes.map((it) => toText(makeBrutto(it)))).toEqual([
      "HN",
      "CH2",
      "CH2",
      "CH2",
    ]);
    expect(toText(makeBrutto(expr))).toBe("C3H7N");
  });
  it("Exotic bond definition", () => {
    const expr = compile("HC≡C–CH3");
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("C3H4");
    expect(expr.getAgents()[0]!.bonds.map((it) => it.debugText())).toEqual([
      "0(~0*3)1",
      "1(~0)2",
    ]);
  });
});
