import { ChemBond } from "../../core/ChemBond";
import { ChemBracketBegin, ChemBracketEnd } from "../../core/ChemBracket";
import { ChemNode } from "../../core/ChemNode";
import { ChemObj } from "../../core/ChemObj";
import { makeElemList } from "../../inspectors/makeElemList";
import { textFormula } from "../../textBuilder/textFormula";
import { compile } from "../compile";

describe("branchBrackets", () => {
  it("left to right", () => {
    const f = compile("N(=O)-SH");
    const { commands } = f.getAgents()[0]!;

    const srcNode = commands[0] as ChemNode;
    expect(srcNode).toBeInstanceOf(ChemNode);
    expect(textFormula(srcNode, "text")).toBe("N");
    expect(srcNode.bonds.size).toBe(2);
    const firstSubChain = srcNode.subChain;

    const beginBracket = commands[1] as ChemBracketBegin;
    expect(beginBracket).toBeInstanceOf(ChemBracketBegin);
    expect(beginBracket.isBranchBracket).toBe(true);
    expect(beginBracket.bond?.tx).toBe("=");
    expect(tx(beginBracket.nodes[0])).toBe("N");
    expect(tx(beginBracket.nodes[1])).toBe("O");

    const insideBond = commands[2] as ChemBond;
    expect(insideBond).toBeInstanceOf(ChemBond);
    expect(tx(insideBond.nodes[0])).toBe("N");
    expect(tx(insideBond.nodes[1])).toBe("O");
    expect(insideBond.soft).toBe(true);

    const insideNode = commands[3] as ChemNode;
    expect(insideNode).toBeInstanceOf(ChemNode);
    expect(tx(insideNode)).toBe("O");
    expect(insideNode.subChain).not.toBe(firstSubChain);

    const endBracket = commands[4] as ChemBracketEnd;
    expect(endBracket).toBeInstanceOf(ChemBracketEnd);
    expect(endBracket.isBranchBracket).toBe(true);

    const outsideBond = commands[5] as ChemBond;
    expect(outsideBond).toBeInstanceOf(ChemBond);
    expect(outsideBond.tx).toBe("-");
    expect(outsideBond.soft).toBe(true);
    expect(tx(outsideBond.nodes[0])).toBe("N");
    expect(tx(outsideBond.nodes[1])).toBe("SH");

    const outsideNode = commands[6] as ChemNode;
    expect(outsideNode).toBeInstanceOf(ChemNode);
    expect(textFormula(outsideNode, "text")).toBe("SH");
    expect(outsideNode.subChain).not.toBe(firstSubChain);
    expect(outsideNode.subChain).not.toBe(insideNode.subChain);

    const elemList = makeElemList(f);
    expect(elemList.toString()).toBe("NOSH");

    // text representation
    expect(tx(f)).toBe("N(=O)-SH");
  });

  it("right to left branch brackets", () => {
    const f = compile("HS-(O=)N");
    const { commands } = f.getAgents()[0]!;

    const outsideNode = commands[0] as ChemNode;
    expect(outsideNode).toBeInstanceOf(ChemNode);
    expect(tx(outsideNode)).toBe("HS");

    const outsideBond = commands[1] as ChemBond;
    expect(outsideBond).toBeInstanceOf(ChemBond);
    expect(textFormula(outsideBond, "text")).toBe("-");
    expect(outsideBond.soft).toBe(true);
    expect(tx(outsideBond.nodes[0])).toBe("HS");
    expect(tx(outsideBond.nodes[1])).toBe("N");

    const beginBracket = commands[2] as ChemBracketBegin;
    expect(beginBracket).toBeInstanceOf(ChemBracketBegin);
    expect(beginBracket.text).toBe("(");
    expect(beginBracket.isBranchBracket).toBe(true);
    expect(beginBracket.bond).toBeUndefined();
    expect(beginBracket.nodes[0]).toBeUndefined();
    expect(tx(beginBracket.nodes[1])).toBe("O");

    const insideNode = commands[3] as ChemNode;
    expect(insideNode).toBeInstanceOf(ChemNode);
    expect(tx(insideNode)).toBe("O");

    const insideBond = commands[4] as ChemBond;
    expect(insideBond).toBeInstanceOf(ChemBond);
    expect(insideBond.tx).toBe("=");
    expect(insideBond.soft).toBe(true);
    expect(tx(insideBond.nodes[0])).toBe("O");
    expect(tx(insideBond.nodes[1])).toBe("N");

    const endBracket = commands[5] as ChemBracketEnd;
    expect(endBracket).toBeInstanceOf(ChemBracketEnd);
    expect(endBracket.text).toBe(")");
    expect(endBracket.isBranchBracket).toBe(true);
    expect(endBracket.bond?.tx).toBe("=");

    const srcNode = commands[6] as ChemNode;
    expect(srcNode).toBeInstanceOf(ChemNode);
    expect(tx(srcNode)).toBe("N");
    expect(srcNode.bonds.size).toBe(2);
    expect(srcNode.subChain).not.toBe(insideNode.subChain);

    // text representation
    expect(textFormula(f, "text")).toBe("HS-(O=)N");
  });

  it("double branch brackets", () => {
    const f = compile("S(=O)(=Se)-CN");
    expect(f.getMessage()).toBe("");
    const { commands } = f.getAgents()[0]!;
    // 0: S
    // 1: (
    // 2: =
    // 3: O
    // 4: )
    // 5: (
    // 6: =
    // 7: Se
    // 8: )
    // 9: -
    // 10: cN
    expect(commands.length).toBe(11);

    const beginBracket1 = commands[1] as ChemBracketBegin;
    expect(beginBracket1).toBeInstanceOf(ChemBracketBegin);
    expect(beginBracket1.isBranchBracket).toBe(true);
    expect(tx(beginBracket1.nodes[0])).toBe("S");
    expect(beginBracket1.bond?.debugText()).toBe("0(~0*2)1");

    const beginBracket2 = commands[5] as ChemBracketBegin;
    expect(beginBracket2).toBeInstanceOf(ChemBracketBegin);
    expect(beginBracket2.isBranchBracket).toBe(true);
    expect(tx(beginBracket2.nodes[0])).toBe("S");
    expect(tx(beginBracket2.nodes[1])).toBe("Se");
    expect(beginBracket2.bond?.debugText()).toBe("0(~0*2)2");

    const insideBond2 = commands[6] as ChemBond;
    expect(insideBond2).toBeInstanceOf(ChemBond);
    expect(tx(insideBond2.nodes[0])).toBe("S");
    expect(tx(insideBond2.nodes[1])).toBe("Se");

    const endBracket2 = commands[8] as ChemBracketEnd;
    expect(endBracket2).toBeInstanceOf(ChemBracketEnd);
    expect(endBracket2.isBranchBracket).toBe(true);
    expect(tx(endBracket2.nodes[0])).toBe("Se");
    expect(tx(endBracket2.nodes[1])).toBe("");

    const outsideBond = commands[9] as ChemBond;
    expect(outsideBond).toBeInstanceOf(ChemBond);
    expect(tx(outsideBond.nodes[0])).toBe("S");
    expect(tx(outsideBond.nodes[1])).toBe("CN");
  });
});

const tx = (src: ChemObj | undefined): string =>
  src ? textFormula(src, "text") : "";
