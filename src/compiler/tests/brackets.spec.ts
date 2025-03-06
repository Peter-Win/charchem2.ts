import { ChemObj } from "../../core/ChemObj";
import { ChemNode } from "../../core/ChemNode";
import { ChemBond } from "../../core/ChemBond";
import { ChemBracketBegin, ChemBracketEnd } from "../../core/ChemBracket";
import { textFormula } from "../../textBuilder/textFormula";
import { compile } from "../compile";
import { PeriodicTable } from "../../core/PeriodicTable";
import { roundMass } from "../../math/massUtils";
import { calcMass } from "../../inspectors/calcMass";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { lastItem } from "../../utils/lastItem";
import { isAbstract } from "../../inspectors/isAbstract";
import { calcCharge } from "../../inspectors/calcCharge";

const toText = (obj: ChemObj) => textFormula(obj, "text");
const toHtml = (obj: ChemObj) =>
  textFormula(obj, {
    type: "text",
    options: {
      sub: (text) => `<sub>${text}</sub>`,
      sup: (text) => `<sup>${text}</sup>`,
    },
  });

const cmd2str = (cmd: ChemObj): string => {
  if (cmd instanceof ChemNode && cmd.autoMode) return "Auto";
  if (cmd instanceof ChemBond && cmd.isNeg) return `\`${toText(cmd)}`;
  return toText(cmd);
};

describe("Brackets", () => {
  it("ErrorAnotherBracket", () => {
    const expr = compile("Ca(OH]2");
    expect(expr.getMessage("ru")).toBe("Требуется ) вместо ] в позиции 6");
  });
  it("ErrorNotClosed", () => {
    const expr = compile("Ca(OH2");
    expect(expr.getMessage("ru")).toBe(
      "Необходимо закрыть скобку, открытую в позиции 3"
    );
  });
  it("ErrorNotOpen", () => {
    const expr = compile("CaOH)2");
    expect(expr.getMessage("ru")).toBe(
      "Нет пары для скобки, закрытой в позиции 5"
    );
  });
  it("ErrorNestedBranch", () => {
    const expr = compile("H-C<|(CH2>");
    expect(expr.getMessage("ru")).toBe(
      "Нельзя закрыть ветку в позиции 10, пока не закрыта скобка в позиции 6"
    );
  });
  it("ErrorNestedBracket", () => {
    const expr = compile("H-C<|CH2)>");
    expect(expr.getMessage("ru")).toBe(
      "Нельзя закрыть скобку в позиции 9, пока не закрыта ветка в позиции 4"
    );
  });
  it("SimpleRoundBrackets", () => {
    const expr = compile("(NH4)2SO4");
    expect(expr.getMessage()).toBe("");
    expect(toText(expr)).toBe("(NH4)2SO4");

    const { commands } = expr.getAgents()[0]!;
    expect(commands[0]).toBeInstanceOf(ChemBracketBegin);
    expect(commands[0]).toHaveProperty("text", "(");
    expect(commands[2]).toBeInstanceOf(ChemBracketEnd);
    expect(commands[2]).toHaveProperty("text", ")");

    const { dict } = PeriodicTable;
    const m = dict.H.mass * 8 + dict.N.mass * 2 + dict.O.mass * 4 + dict.S.mass;
    expect(roundMass(calcMass(expr))).toBe(roundMass(m));
    expect(toText(makeBrutto(expr))).toBe("H8N2O4S");
  });
  it("SquareBrackets", () => {
    const expr = compile("K3[Fe(CN)6]");
    expect(expr.getMessage()).toBe("");
    const cm = expr.getAgents()[0]!.commands;
    expect(cmd2str(cm[0]!)).toEqual("K3");
    expect(cmd2str(cm[1]!)).toEqual("[");
    expect(cmd2str(cm[2]!)).toEqual("Fe");
    expect(cmd2str(cm[3]!)).toEqual("(");
    expect(cmd2str(cm[4]!)).toEqual("CN");
    expect(cmd2str(cm[5]!)).toEqual(")6");
    expect(cmd2str(cm[6]!)).toEqual("]");
    expect(toHtml(expr)).toEqual("K<sub>3</sub>[Fe(CN)<sub>6</sub>]");
    expect(toText(makeBrutto(expr))).toBe("C6FeK3N6");
  });
  it("Charge", () => {
    const expr = compile("[SO4]^2-");
    expect(expr.getMessage()).toBe("");
    expect(toHtml(expr)).toBe("[SO<sub>4</sub>]<sup>2-</sup>");
    expect(toText(makeBrutto(expr))).toBe("O4S^2-");
  });
  it("ChargePrefix", () => {
    const expr = compile("[SO4]`^-2");
    expect(expr.getMessage()).toBe("");
    const bracketEnd = lastItem(expr.getAgents()[0]!.commands);
    expect(bracketEnd).toBeInstanceOf(ChemBracketEnd);
    const { charge } = bracketEnd! as ChemBracketEnd;
    expect(charge).toBeDefined();
    expect(charge!.text).toBe("-2");
    expect(charge!.isLeft).toBe(true);
    expect(toHtml(expr)).toBe("<sup>-2</sup>[SO<sub>4</sub>]");
    expect(toHtml(makeBrutto(expr))).toBe("O<sub>4</sub>S<sup>2-</sup>");
  });
  it("InputBond", () => {
    const expr = compile("H-[Cu<|Br><`|Br>]");
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("HBr2Cu");
  });
  it("OutputBond", () => {
    const expr = compile("[Cu<|Br><`|Br>]-H");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    // 0:[, 1:Cu, 2:|, 3:Br, 4:`|, 5:Br, 6:], 7:-, 8:H
    expect(agent.commands.map((it) => cmd2str(it))).toEqual([
      "[",
      "Cu",
      "|",
      "Br",
      "`|",
      "Br",
      "]",
      "-",
      "H",
    ]);
    const bracketEnd = agent.commands[6] as ChemBracketEnd;
    expect(bracketEnd).toBeInstanceOf(ChemBracketEnd);
    const { nodeIn } = bracketEnd;
    expect(nodeIn).toBeDefined();
    expect(toText(nodeIn!)).toBe("Cu");
    const bracketEndBond = bracketEnd.bond;
    expect(bracketEndBond).toBeDefined();
    expect(toText(bracketEndBond!)).toBe("-");

    expect(toText(makeBrutto(expr))).toBe("HBr2Cu");
  });
  it("InputOutputBond", () => {
    const expr = compile("H-(CH2)4-Cl");
    expect(expr.getMessage()).toBe("");
    expect(toHtml(expr)).toBe("H-(CH<sub>2</sub>)<sub>4</sub>-Cl");
    expect(toText(makeBrutto(expr))).toBe("C4H9Cl");
  });
  it("Fenestrane5555", () => {
    // see https://en.wikipedia.org/wiki/Fenestrane
    //  2(H2C)-+-(CH2)2
    //      |  |  |
    //      +--+--+
    //      |  |  |
    //  2(H2C)-+-(CH2)2
    // PS. this formula is not compiled correct by ver 1.0 of CharChem
    const expr = compile("-(CH2)2|`-`|`-(H2C)`2|-|<`-(H2C)`2`|>-(CH2)2`|");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds).toHaveLength(12);
    expect(agent.bonds[0]!.soft).toBe(false);
    const cm = agent.commands.map(cmd2str);
    let i = 0;
    expect(cm[i++]).toBe("Auto");
    expect(cm[i++]).toBe("-");
    expect(cm[i++]).toBe("(");
    expect(cm[i++]).toBe("CH2");
    expect(cm[i++]).toBe(")2");
    expect(cm[i++]).toBe("|");
    expect(cm[i++]).toBe("Auto");
    expect(cm[i++]).toBe("`-");
    expect(cm[i++]).toBe("Auto");
    expect(cm[i++]).toBe("`|");
    expect(cm[i++]).toBe("`-");
    expect(cm[i++]).toBe("("); // Open bracket first!
    expect(cm[i++]).toBe("H2C");
    expect(cm[i++]).toBe(")2");
    expect(cm[i++]).toBe("|");
    expect(cm[i++]).toBe("Auto");
    expect(cm[i++]).toBe("-");
    expect(cm[i++]).toBe("|");
    expect(cm[i++]).toBe("Auto");
    expect(cm[i++]).toBe("`-");
    expect(cm[i++]).toBe("(");
    expect(cm[i++]).toBe("H2C");
    expect(cm[i++]).toBe(")2");
    expect(cm[i++]).toBe("`|");
    expect(cm[i++]).toBe("-");
    expect(cm[i++]).toBe("(");
    expect(cm[i++]).toBe("CH2");
    expect(cm[i++]).toBe(")2");
    expect(cm[i++]).toBe("`|");

    expect(agent.nodes).toHaveLength(9);
    expect(agent.nodes.map((it) => it.pt.toString())).toEqual([
      "(0, 0)",
      "(1, 0)",
      "(1, 1)",
      "(0, 1)",
      "(-1, 0)",
      "(-1, 1)",
      "(0, 2)",
      "(-1, 2)",
      "(1, 2)",
    ]);
    expect(toText(makeBrutto(expr))).toBe("C13H20");
  });
  it("FenestraneAbs", () => {
    // see https://en.wikipedia.org/wiki/Fenestrane
    // ┌   ┐     ┌   ┐
    // │ ┌-┼--┬--┼-┐ |     4<---0--->1
    // └ | ┘n |  └ | ┘n    ↓    ↑    ↓
    //   ├----┼----┤       5--->3<---2
    // ┌ | ┐  |  ┌ | ┐     ↑    ↓    ↑
    // | └-┼--┴--┼-┘ |     7<---6--->8
    // └   ┘n    └   ┘n
    // This formula is not correct for ver 1.0 of CharChem
    const expr = compile("-[]'n'|`-`|`-[]'n'|-|<`-[]'n'`|>-[]'n'`|");
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(true);
    const agent = expr.getAgents()[0]!;
    const { nodes } = agent;
    expect(nodes.map((it) => it.pt.toString())).toEqual([
      "(0, 0)",
      "(1, 0)",
      "(1, 1)",
      "(0, 1)",
      "(-1, 0)",
      "(-1, 1)",
      "(0, 2)",
      "(-1, 2)",
      "(1, 2)",
    ]);
    expect(nodes.map((it) => toText(makeBrutto(it)))).toEqual([
      "CH",
      "CH2",
      "CH",
      "C",
      "CH2",
      "CH",
      "CH",
      "CH2",
      "CH2",
    ]);
  });

  // Cases from http://charchem.org/ru/new-features

  it("Acetone", () => {
    const expr = compile("$ver(1.0)H3C(C=O)CH3");
    expect(expr.getMessage()).toBe("");
    expect(toText(expr)).toBe("H3C(C=O)CH3");
    expect(toText(makeBrutto(expr))).toBe("C3H6O");
    const { dict } = PeriodicTable;
    expect(calcMass(expr)).toBe(
      roundMass(dict.C.mass * 3 + dict.H.mass * 6 + dict.O.mass)
    );
  });

  it("PolyChloride", () => {
    //     ┌       ┐
    //     |/\\    |/\
    //    /|   \\/ |   \
    //  Cl |    |  |    Cl
    //     |    Cl |
    //     └       ┘10
    const expr = compile("$ver(1.0)Cl/[\\\\<|Cl>]10/\\Cl");
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("C21H12Cl12");
    expect(expr.getAgents()[0]!.commands.map(cmd2str)).toEqual([
      "Cl",
      "/",
      "[",
      "Auto",
      "\\\\",
      "Auto",
      "|",
      "Cl",
      "]10",
      "/",
      "Auto",
      "\\",
      "Cl",
    ]);
    const { dict } = PeriodicTable;
    expect(roundMass(calcMass(expr))).toBe(
      roundMass(
        dict.Cl.mass * 2 +
          dict.C.mass +
          dict.H.mass * 2 +
          10 * (dict.C.mass * 2 + dict.H.mass + dict.Cl.mass)
      )
    );
  });
  it("Connect Of Last Node In Brackets With Next Bond", () => {
    //   ┌    O 2   ┐
    //   |    ||    |    2+
    //   |   /1 \   |  Mg
    //   └ HO    O- ┘2  4
    //      0    3
    const expr = compile("[HO/`|O|\\O^-]2_(x1.6,y#-1;-2,N0)Mg^2+");
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("C2H2MgO6");
    expect(calcCharge(expr)).toBe(0.0);
  });
  it("BranchAfterBracket", () => {
    //  ┌    ┐/I
    //  | Mg<|
    //  └    ┘\I
    const expr = compile("[Mg]<_(x2,y-1)I><_(x2,y1)I>");
    expect(expr.getMessage()).toBe("");
    expect(toText(makeBrutto(expr))).toBe("I2Mg");
  });
});
