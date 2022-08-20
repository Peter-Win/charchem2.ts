import { ChemCompiler } from "../ChemCompiler";
import { ChemK } from "../../core/ChemK";
import { scanTo } from "./scan";
import { CoeffPos } from "../../types/CoeffPos";

export const scanCoeff = (compiler: ChemCompiler): ChemK | undefined => {
  const getCoeffPos = (): CoeffPos | undefined =>
    compiler.getAltFlag() ? "LB" : undefined;
  let ch = compiler.text[compiler.pos];
  if (ch === "`") {
    compiler.setAltFlag();
    ch = compiler.text[++compiler.pos];
  }
  const pos0 = compiler.pos;
  if (ch) {
    if (ch >= "0" && ch <= "9") {
      // Числовой коэфф
      compiler.pos++;
      while (!compiler.isFinish()) {
        ch = compiler.text[compiler.pos];
        if (!ch || ch < "0" || ch > "9") break;
        compiler.pos++;
      }
      const s = compiler.subStr(pos0);
      return new ChemK(+s, getCoeffPos());
    }
    if (ch === "'") {
      // Абстрактный коэфф.
      compiler.pos++;
      if (!scanTo(compiler, "'"))
        compiler.error("Abstract coefficient is not closed", { pos: pos0 });
      const s = compiler.subStr(pos0 + 1);
      compiler.pos++;
      return new ChemK(s, getCoeffPos());
    }
  }
  return undefined;
};
