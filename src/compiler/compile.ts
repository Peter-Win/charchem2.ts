import { ChemExpr } from "../core/ChemExpr";
import { ChemCompiler } from "./ChemCompiler";
import { closeEntity } from "./main/entity";
import { prepareText } from "./parse/prepareText";

export const compile = (text: string): ChemExpr => {
  const compiler = new ChemCompiler(text);
  try {
    prepareText(compiler);
    while (!compiler.isFinish()) {
      const step = compiler.curState(compiler);
      compiler.pos += step;
    }
    closeEntity(compiler);
  } catch (e) {
    compiler.expr.error = e;
  }
  return compiler.expr;
};
