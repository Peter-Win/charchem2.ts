import { ChemObj } from "../../core/ChemObj";
import { ChemExpr } from "../../core/ChemExpr";
import { ChemMul, ChemMulEnd } from "../../core/ChemMul";
import { ChemNode } from "../../core/ChemNode";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { calcMass } from "../../inspectors/calcMass";
import { isAbstract } from "../../inspectors/isAbstract";
import { compile } from "../compile";
import { rulesHtml } from "../../textRules/rulesHtml";
import { PeriodicTable } from "../../core/PeriodicTable";
import { roundMass } from "../../math/massUtils";

const cmd2str = (cmd: ChemObj): string => {
  if (cmd instanceof ChemMul) {
    return `${cmd.isFirst ? "" : "*"}${cmd.n}{{`;
  }
  if (cmd instanceof ChemMulEnd) {
    return "}}";
  }
  return cmd instanceof ChemNode && cmd.autoMode
    ? "Auto"
    : makeTextFormula(cmd);
};

const getCommand = (expr: ChemExpr, i: number): ChemObj =>
  expr.getAgents()[0]!.commands[i]!;

const getCommands = (expr: ChemExpr): string[] =>
  expr.getAgents()[0]!.commands.map((it) => cmd2str(it));

describe("Mul", () => {
  it("FirstCoeff", () => {
    const expr = compile("[2H2O]");
    expect(expr.getMessage()).toBe("");
    expect(getCommands(expr)).toEqual(["[", "2{{", "H2O", "}}", "]"]);
    expect(makeTextFormula(expr, rulesHtml)).toBe("[2H<sub>2</sub>O]");
    const cmd = getCommand(expr, 1) as ChemMul;
    expect(cmd).toBeInstanceOf(ChemMul);
    expect(cmd.nodes[0]).toBeUndefined();
    expect(cmd.nodes[1]).toBeDefined();
    expect(makeTextFormula(cmd.nodes[1]!)).toBe("H2O");
  });
  it("Simple", () => {
    const expr = compile("CuSO4*5H2O");
    expect(expr.getMessage()).toBe("");
    expect(getCommands(expr)).toEqual(["CuSO4", "*5{{", "H2O", "}}"]);
    expect(makeTextFormula(expr)).toBe("CuSO4∙5H2O");
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      "CuSO<sub>4</sub>∙5H<sub>2</sub>O"
    );
    const { dict } = PeriodicTable;
    const mH = dict.H.mass;
    const mO = dict.O.mass;
    const mS = dict.S.mass;
    const mCu = dict.Cu.mass;
    expect(roundMass(calcMass(expr))).toBe(
      roundMass(mCu + mS + mO * 4 + 5 * (mH * 2 + mO))
    );
    const cmd = getCommand(expr, 1) as ChemMul;
    expect(cmd).toBeInstanceOf(ChemMul);
    expect(cmd.nodes[0]).toBeDefined();
    expect(makeTextFormula(cmd.nodes[0]!)).toBe("CuSO4");
    expect(cmd.nodes[1]).toBeDefined();
    expect(makeTextFormula(cmd.nodes[1]!)).toBe("H2O");
  });
  it("NestedBrackets", () => {
    const expr = compile("[2Ca(OH)2*3Mg(OH)2]");
    expect(expr.getMessage()).toBe("");
    expect(getCommands(expr)).toEqual([
      "[",
      "2{{",
      "Ca",
      "(",
      "OH",
      ")2",
      "}}",
      "*3{{",
      "Mg",
      "(",
      "OH",
      ")2",
      "}}",
      "]",
    ]);
    const { dict } = PeriodicTable;
    const mOH2 = 2 * (dict.H.mass + dict.O.mass);
    const mCa = dict.Ca.mass;
    const mMg = dict.Mg.mass;
    expect(roundMass(calcMass(expr))).toBe(
      roundMass(2 * (mCa + mOH2) + 3 * (mMg + mOH2))
    );
    expect(makeTextFormula(makeBrutto(expr))).toBe("H10Ca2Mg3O10");
    {
      const m1 = getCommand(expr, 1) as ChemMul;
      expect(m1).toBeInstanceOf(ChemMul);
      expect(m1.nodes[0]).toBeUndefined();
      expect(m1.nodes[1]).toBeDefined();
      expect(makeTextFormula(m1.nodes[1]!)).toBe("Ca");
    }
    {
      const m2 = getCommand(expr, 7) as ChemMul;
      expect(m2).toBeInstanceOf(ChemMul);
      expect(m2.nodes[0]).not.toBeDefined();
      expect(m2.nodes[1]).toBeDefined();
      expect(makeTextFormula(m2.nodes[1]!)).toBe("Mg");
    }
  });
  it("Abstract", () => {
    // Limonite
    const expr = compile("FeO(OH)*'n'H2O");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("FeO(OH)∙nH2O");
    expect(isAbstract(expr)).toBe(true);
  });
});
