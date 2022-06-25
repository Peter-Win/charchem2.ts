import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { isDigit } from "./isDigit";

export const scanInt = (compiler: ChemCompiler): Int | undefined => {
  const oldPos = compiler.pos;
  if (compiler.curChar() === "-" && isDigit(compiler.text[oldPos + 1]!)) {
    compiler.pos++;
  }
  while (isDigit(compiler.curChar())) {
    compiler.pos++;
  }
  return compiler.pos === oldPos ? undefined : +compiler.subStr(oldPos);
};
