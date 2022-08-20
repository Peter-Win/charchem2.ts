import { compile } from "../../compiler/compile";
import { ChemBond } from "../ChemBond";
import {
  ChemBracketBegin,
  ChemBracketEnd,
  getBracketsContent,
} from "../ChemBracket";
import { ChemNode } from "../ChemNode";
import { ChemObj } from "../ChemObj";

describe("getBracketsContent", () => {
  it("Single auto node", () => {
    //     ( * )
    // 0 /12 3 4\56
    // *          *
    const expr = compile("/()3\\");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands.length).toBe(7);
    const [n0, b1, c2, n3] = commands;
    expect(n0).toBeInstanceOf(ChemNode);
    expect(n0).toHaveProperty("autoMode", true);
    expect(b1).toBeInstanceOf(ChemBond);
    expect(c2).toBeInstanceOf(ChemBracketBegin);
    expect(n3).toBeInstanceOf(ChemNode);
    expect(n3).toHaveProperty("autoMode", true);
    expect(n3).toHaveProperty("index", 1);

    const content: ChemObj[] = getBracketsContent(
      c2 as ChemBracketBegin,
      commands
    );
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(ChemNode);
    expect(content[0]).toHaveProperty("index", 1);
  });
  it("Single node in brackets", () => {
    const expr = compile("[H2O]");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands.length).toBe(3);
    const [b1, n2, b3] = commands;
    expect(b1).toBeInstanceOf(ChemBracketBegin);
    expect(n2).toBeInstanceOf(ChemNode);
    expect(b3).toBeInstanceOf(ChemBracketEnd);

    const content = getBracketsContent(b1 as ChemBracketBegin, commands);
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(ChemNode);
    expect(content[0]).toHaveProperty("index", 0);
  });

  it("Two nodes in brackets", () => {
    const expr = compile("(C=O)");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { commands } = agent;
    expect(commands.length).toBe(5);
    const [c1, n2, b3, n4] = commands;
    expect(c1).toBeInstanceOf(ChemBracketBegin);
    expect(n2).toBeInstanceOf(ChemNode);
    expect(n2).toHaveProperty("index", 0);
    expect(b3).toBeInstanceOf(ChemBond);
    expect(n4).toBeInstanceOf(ChemNode);
    expect(n4).toHaveProperty("index", 1);

    const content = getBracketsContent(c1 as ChemBracketBegin, commands);
    expect(content.length).toBe(3);
    expect(content[0]).toBeInstanceOf(ChemNode);
    expect(content[0]).toHaveProperty("index", 0);
    expect(content[1]).toBeInstanceOf(ChemBond);
    expect(content[1]).toHaveProperty("tx", "=");
    expect(content[2]).toBeInstanceOf(ChemNode);
    expect(content[2]).toHaveProperty("index", 1);
  });
});
