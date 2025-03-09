/**
 * Testing for nodes in brackets
 */

import { compile } from "../../compile";
import { ChemBracketBegin, ChemBracketEnd } from "../../../core/ChemBracket";
import { textFormula } from "../../../textBuilder/textFormula";
import { ChemNode } from "../../../core/ChemNode";

const toText = (node: ChemNode) => textFormula(node, "text");

const nodeText = (node?: ChemNode): string => (node ? toText(node) : "");

describe("Bracket nodes", () => {
  it("Nodes without bond", () => {
    //      ┌   ┐
    //      │ O │
    //      │ ‖ │
    // H--Ca│ C │
    //      └   ┘
    const expr = compile("H-Ca(C`||O)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { nodes, commands } = agent;

    // nodes
    const nCa = nodes[1]!;
    const nC = nodes[2]!;
    expect(toText(nCa)).toBe("Ca");
    expect(toText(nC)).toBe("C");
    expect(nCa.chain).toBe(nC.chain);
    expect(nCa.subChain).toBeLessThan(nC.subChain);

    // commands
    expect(commands).toHaveLength(8);
    expect(commands[2]).toBe(nCa);
    expect(commands[3]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[4]).toBe(nC);
    expect(commands[7]).toBeInstanceOf(ChemBracketEnd);
    const brBegin = commands[3] as ChemBracketBegin;

    expect(brBegin.bond).toBeUndefined();
    expect(brBegin.nodes[0]).toBe(nCa);
    expect(brBegin.nodes[1]).toBe(nC);
  });

  it("Fixed bonds", () => {
    //    2  ┌ 4  ┐
    //    O  │ F  │
    //    ‖  │ |  │
    // H--C──┼─Cu─┼──K
    // 0  1  └ 3  ┘  5
    //                    012  3 4  5   6 7  8 9 10 11 12
    const expr = compile("H-C<`||O>_(x2)[Cu<`|hF>]_(x2)K");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    const brBegin = commands[6] as ChemBracketBegin;
    const brEnd = commands[10] as ChemBracketEnd;
    expect(brBegin).toBeInstanceOf(ChemBracketBegin);
    expect(brEnd).toBeInstanceOf(ChemBracketEnd);
    expect(nodeText(brBegin.nodes[0])).toBe("C");
    expect(nodeText(brBegin.nodes[1])).toBe("Cu");
    expect(nodeText(brEnd.nodes[0])).toBe("Cu");
    expect(nodeText(brEnd.nodes[1])).toBe("K");
    // Если внешний и внутренний узлы в одной подцепи, то скобка не образует мостик
    expect(brBegin.nodes[0]!.chain).toBe(brBegin.nodes[1]!.chain);
    expect(brBegin.nodes[0]!.subChain).toBe(brBegin.nodes[1]!.subChain);
    expect(brEnd.nodes[0]!.chain).toBe(brEnd.nodes[1]!.chain);
    expect(brEnd.nodes[0]!.subChain).toBe(brEnd.nodes[1]!.subChain);
  });
  it("Soft bonds", () => {
    //    2  ┌ 4  ┐
    //    O  │ F  │
    //    ‖  │ |  │
    // H--C--│ Cu │--K
    // 0  1  └ 3  ┘  5
    //  commands:         012  3 4  5   6 7  8 9 10 11 12
    const expr = compile("H-C<`||O>_(x2)[Cu<`|hF>]_(x2)K");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    const brBegin = commands[6] as ChemBracketBegin;
    const brEnd = commands[10] as ChemBracketEnd;
    expect(brBegin).toBeInstanceOf(ChemBracketBegin);
    expect(brEnd).toBeInstanceOf(ChemBracketEnd);
    expect(nodeText(brBegin.nodes[0])).toBe("C");
    expect(nodeText(brBegin.nodes[1])).toBe("Cu");
    expect(nodeText(brEnd.nodes[0])).toBe("Cu");
    expect(nodeText(brEnd.nodes[1])).toBe("K");
    // Если внешний и внутренний узлы в одной подцепи, то скобка не образует мостик
    expect(brBegin.nodes[0]!.chain).toBe(brBegin.nodes[1]!.chain);
    expect(brBegin.nodes[0]!.subChain).toBe(brBegin.nodes[1]!.subChain);
    expect(brEnd.nodes[0]!.chain).toBe(brEnd.nodes[1]!.chain);
    expect(brEnd.nodes[0]!.subChain).toBe(brEnd.nodes[1]!.subChain);
  });
  it("bridge between bracket and node", () => {
    const expr = compile("[OH]H");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { nodes } = agent;
    expect(nodes).toHaveLength(2);
    const n0 = nodes[0]!;
    const n1 = nodes[1]!;
    expect(n1.subChain).toBeGreaterThan(n0.subChain);
  });
  it("color of brackets", () => {
    // 012 34
    // [(OH)]
    const expr = compile("$color(blue)[$color(red)($color()OH)2]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands).toHaveLength(5);
    expect(commands[0]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[1]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[2]).toBeInstanceOf(ChemNode);
    expect(commands[3]).toBeInstanceOf(ChemBracketEnd);
    expect(commands[4]).toBeInstanceOf(ChemBracketEnd);
    expect(commands[0]).toHaveProperty("color", "blue");
    expect(commands[1]).toHaveProperty("color", "red");
    expect(commands[2]).toHaveProperty("color", undefined); // Перед узлом стоит $color()
    expect(commands[3]).toHaveProperty("color", "red");
    expect(commands[4]).toHaveProperty("color", "blue");
  });
  it("padding", () => {
    const expr = compile("$padding(.1,.4)[OH][H]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands[0]).toBeInstanceOf(ChemBracketBegin);
    expect((commands[0] as ChemBracketBegin).padding).toEqual([0.1, 0.4]);
    expect(commands[3]).toBeInstanceOf(ChemBracketBegin);
    expect((commands[3] as ChemBracketBegin).padding).toBeUndefined();
  });
});
