import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { calcMass } from "../../inspectors/calcMass";
import { roundMass } from "../../math/massUtils";
import { PeriodicTable } from "../../core/PeriodicTable";
import { ChemNode } from "../../core/ChemNode";
import { ChemBond } from "../../core/ChemBond";
import { is0 } from "../../math";

describe("RingBond", () => {
  it("SimpleSquare", () => {
    const expr = compile("-|`-`|_o");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(4);
  });
  it("SingleRingWithBranches", () => {
    //    0 CH3
    //      |   3OH
    //  8 / 1 \2/
    //   |  O  |
    //  7 \ 5 /4
    //      |
    //     6Cl
    const expr = compile("CH3|\\</OH>|`/<|Cl>`\\`|/_o");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const bonds = Array.from(agent.bonds);
    expect(
      bonds.map((bond) =>
        bond.nodes.map((it) => `${it?.index ?? "null"}`).join(bond.tx)
      )
    ).toEqual([
      "0|1",
      "1\\2",
      "2/3",
      "2|4",
      "4/5",
      "5|6",
      "5\\7",
      "7|8",
      "8/1",
      "1o2o4o5o7o8",
    ]);

    expect(makeTextFormula(makeBrutto(expr))).toBe("C7H7ClO");
    const { dict } = PeriodicTable;
    expect(roundMass(roundMass(calcMass(expr)))).toBe(
      roundMass(dict.C.mass * 7 + dict.H.mass * 7 + dict.Cl.mass + dict.O.mass)
    );
  });
  it("DoubleRing", () => {
    //  5---1---2
    //  | O | O |
    //  6---4---3
    const expr = compile("-|`-`|_o`-|-_o");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C6H4");
  });
  it("Pyrene", () => {
    const expr = compile("`/|\\/`|`\\_o`|/\\|`/_o|0\\/`|`\\_o`|0/\\|`/_o");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const bonds = Array.from(agent.bonds);
    const nodeDef = (node?: ChemNode): string =>
      node ? `${node.index}` : "null";
    const bondTx = (bond: ChemBond): string =>
      bond.isAuto
        ? `${Math.round(bond.dir!.polarAngleDeg())}${is0(bond.n) ? "x0" : ""}`
        : bond.linearText();

    const bondDef = (bond: ChemBond) =>
      `${bond.linearText()}: ${bond.nodes
        .map((it) => nodeDef(it))
        .join(` ${bondTx(bond)} `)}`;

    expect(bondDef(bonds[0]!)).toBe("`/: 0 150 1");
    expect(bondDef(bonds[1]!)).toBe("|: 1 90 2");
    expect(bondDef(bonds[2]!)).toBe("\\: 2 30 3");
    expect(bondDef(bonds[3]!)).toBe("/: 3 -30 4");
    expect(bondDef(bonds[4]!)).toBe("`|: 4 -90 5");
    expect(bondDef(bonds[5]!)).toBe("`\\: 5 -150 0");
    expect(bondDef(bonds[6]!)).toBe("o: 0 o 1 o 2 o 3 o 4 o 5");
    expect(bondDef(bonds[7]!)).toBe("`|: 0 -90 6");
    expect(bondDef(bonds[8]!)).toBe("/: 6 -30 7");
    expect(bondDef(bonds[9]!)).toBe("\\: 7 30 8");
    expect(bondDef(bonds[10]!)).toBe("|: 8 90 9");
    expect(bondDef(bonds[11]!)).toBe("`/: 9 150 5");
    expect(bondDef(bonds[12]!)).toBe("o: 5 o 0 o 6 o 7 o 8 o 9");
    expect(bondDef(bonds[13]!)).toBe("\\: 4 30 10");
    expect(bondDef(bonds[14]!)).toBe("/: 10 -30 11");
    expect(bondDef(bonds[15]!)).toBe("`|: 11 -90 12");
    expect(bondDef(bonds[16]!)).toBe("`\\: 12 -150 9");
    expect(bondDef(bonds[17]!)).toBe("o: 9 o 5 o 4 o 10 o 11 o 12");
    expect(bondDef(bonds[18]!)).toBe("/: 8 -30 13");
    expect(bondDef(bonds[19]!)).toBe("\\: 13 30 14");
    expect(bondDef(bonds[20]!)).toBe("|: 14 90 15");
    expect(bondDef(bonds[21]!)).toBe("`/: 15 150 12");
    expect(bondDef(bonds[22]!)).toBe("o: 12 o 9 o 8 o 13 o 14 o 15");

    expect(makeTextFormula(makeBrutto(expr))).toBe("C16H10");
  });
  it("RingInBranch", () => {
    // Закрытие кольца внутри ветки
    // PS. Такое не работает в версиях ниже 1.2
    const expr = compile("|`/`\\`|</\\_o>`\\");
    expect(expr.getMessage()).toBe("");
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(
      bonds.map(
        (b) =>
          `${b.linearText()} [${b.nodes
            .map((it) => it?.index ?? "null")
            .join(", ")}]`
      )
    ).toEqual([
      "| [0, 1]",
      "`/ [1, 2]",
      "`\\ [2, 3]",
      "`| [3, 4]",
      "/ [4, 5]",
      "\\ [5, 0]",
      "o [0, 1, 2, 3, 4, 5]",
      "`\\ [4, 6]",
    ]);
  });
  it("WithPolygonalBond", () => {
    //  9 N---CH  4 H2C---CH2 0
    //   /     \     /    |
    // HC 8   5 C--HC 3   |
    //   \     /     \    |
    // 7 HC---CH 6  2 N---CH2 1
    const expr = compile(
      "CH2_(y1.2)CH2_pN_pHC_pH2C_p; #-2`-C`/CH_p6HC_p6HC_p6N_p6CH_p6_o"
    );
    expect(expr.getMessage("")).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes.map((it) => makeTextFormula(it))).toEqual([
      "CH2",
      "CH2",
      "N",
      "HC",
      "H2C",
      "C",
      "CH",
      "HC",
      "HC",
      "N",
      "CH",
    ]);
  });
  it("Phenanthrene", () => {
    //        8__9
    //  13__7/   \1__2
    // 12/   \6_0/   \3
    //   \___/   \5__/4
    //   11  10
    const expr = compile("/-\\`/`-`\\_o`-`\\/-\\`/0_o`-0`/`-`\\/-\\0_o");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C14H10");
  });
  it("DDT", () => {
    //        0 Cl
    //      8   |   14
    //    7/ \2/1\9/ \
    //    |   |   |   |12
    // 6 /5\ /3  10\ / \
    //  Cl  4      11   Cl 13
    const expr = compile("Cl|<`/|`/`\\<`/Cl>`|/\\_o>\\|\\/<\\Cl>`|`\\`/_o");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(makeBrutto(expr))).toBe("C13H9Cl3");
  });
});
