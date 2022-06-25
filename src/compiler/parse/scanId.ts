import { Char } from "../../types";
import { ChemCompiler } from "../ChemCompiler";

export const isIdFirstChar = (c: Char): boolean => /[A-Za-z]/.test(c);

const isIdChar = (c: Char): boolean => /[A-Z\d]/i.test(c);

export const isId = (text: string): boolean => {
  if (!text || !isIdFirstChar(text[0]!)) return false;
  return !Array.from(text.slice(1)).find((it) => !isIdChar(it));
};

export const scanId = (compiler: ChemCompiler): string | undefined => {
  const startPos = compiler.pos;
  if (isIdFirstChar(compiler.curChar())) {
    compiler.pos++;
    while (isIdChar(compiler.curChar())) compiler.pos++;
  }
  const id = compiler.subStr(startPos);
  return id === "" ? undefined : id;
};
