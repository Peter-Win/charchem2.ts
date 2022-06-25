import { ChemCompiler } from "../ChemCompiler";
import { ChemK } from "../../core/ChemK";
import { scanTo } from "./scan";

export const scanCoeff = (compiler: ChemCompiler): ChemK | undefined => {
  const pos0 = compiler.pos;
  let ch = compiler.text[compiler.pos];
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
      return new ChemK(+s);
    }
    if (ch === "'") {
      // Абстрактный коэфф.
      compiler.pos++;
      if (!scanTo(compiler, "'"))
        compiler.error("Abstract coefficient is not closed", { pos: pos0 });
      const s = compiler.subStr(pos0 + 1);
      compiler.pos++;
      return new ChemK(s);
    }
  }
  return undefined;
};
