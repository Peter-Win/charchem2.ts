import { ChemCompiler } from "../ChemCompiler";
import { isSpace } from "./isSpace";

export const skipSpaces = (compiler: ChemCompiler) => {
  while (compiler.pos < compiler.text.length && isSpace(compiler.curChar()))
    compiler.pos++;
};
