import { ChemExpr } from "../core/ChemExpr";
import { ChemCompiler } from "./ChemCompiler";
import { ChemCompilerOptions } from "./ChemCompilerOptions";
import { closeEntity } from "./main/entity";
import { prepareText } from "./parse/prepareText";

export const compile = (
  text: string,
  options?: ChemCompilerOptions
): ChemExpr => {
  const compiler = new ChemCompiler(text, options);
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
