import { compile } from "../../compiler/compile";
import { ChemBracketBegin } from "../ChemBracket";
import { isTextBrackets, isTextBracketsCached } from "../isTextBrackets";

describe("isTextBrackets", () => {
  it("Simple text case", () => {
    const expr = compile("Ca(OH)2");
    expect(expr.getMessage()).toBe("");
    const { commands } = expr.getAgents()[0]!;
    expect(commands).toHaveLength(4); // 0:Ca, 1:(, 2:OH, 3:)
    expect(commands[1]).toBeInstanceOf(ChemBracketBegin);
    const begin = commands[1] as ChemBracketBegin;
    expect(begin.isText).toBeUndefined();
    expect(isTextBracketsCached(begin, commands)).toBe(true);
    expect(begin.isText).toBe(true);
    expect(isTextBracketsCached(begin, commands)).toBe(true);
  });
  it("Nested text case", () => {
    const expr = compile("K3[Fe(CN)6]");
    expect(expr.getMessage()).toBe("");
    const { commands } = expr.getAgents()[0]!;
    // 0 1 2  3 4  5 6
    // K [ Fe ( CN ) ]
    expect(commands).toHaveLength(7);
    expect(commands[1]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[3]).toBeInstanceOf(ChemBracketBegin);
    const brOut = commands[1] as ChemBracketBegin;
    const brIn = commands[3] as ChemBracketBegin;
    expect(isTextBrackets(brIn, commands)).toBe(true);
    expect(isTextBrackets(brOut, commands)).toBe(true);
  });
  it("Simple non-text case", () => {
    const expr = compile("H-[C<||O>]2-H");
    expect(expr.getMessage()).toBe("");
    const { commands } = expr.getAgents()[0]!;
    // 0 1 2 3  4 5 6 7 8
    // H - [ C || O ] - H
    expect(commands).toHaveLength(9);
    expect(commands[2]).toBeInstanceOf(ChemBracketBegin);
    const begin = commands[1] as ChemBracketBegin;
    expect(isTextBrackets(begin, commands)).toBe(false);
  });
  it("Complex case with text and non-text", () => {
    const expr = compile("[(C<=O>)|(CH2<`-H3N>)]");
    expect(expr.getMessage()).toBe("");
    const { commands } = expr.getAgents()[0]!;
    // 0 1 2 3 4 5 6 7 8   9 10 11 12
    // [ ( C = O ) | ( CH2 - H3N ) ]
    expect(commands).toHaveLength(13);
    expect(commands[0]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[1]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[7]).toBeInstanceOf(ChemBracketBegin);
    const b1 = commands[0] as ChemBracketBegin;
    const b2 = commands[1] as ChemBracketBegin;
    const b3 = commands[7] as ChemBracketBegin;
    expect(isTextBrackets(b1, commands)).toBe(false);
    expect(isTextBrackets(b2, commands)).toBe(true);
    expect(isTextBrackets(b3, commands)).toBe(true);
  });
});
