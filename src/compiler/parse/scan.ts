import { Char } from "../../types";
import { ChemCompiler } from "../ChemCompiler";

export const scan = (
  compiler: ChemCompiler,
  isValid: (c: Char) => boolean
): boolean => {
  while (!compiler.isFinish() && isValid(compiler.curChar())) {
    compiler.pos++;
  }
  return !compiler.isFinish();
};

export const scanTo = (compiler: ChemCompiler, fin: Char): boolean =>
  scan(compiler, (it) => it !== fin);
