import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";

export interface ArgsInfo {
  args: string[];
  argPos: Int[];
}

/**
 * Извлечение списка аргументов.
 * При входе позиция указывает на символ, следующий за (
 * При выходе - на следующий за )
 */
export const scanArgs = (compiler: ChemCompiler): ArgsInfo => {
  const p0 = compiler.pos;
  let prev = p0;
  const args: string[] = [];
  const argPos: Int[] = [];
  let level = 0;
  const addArg = () => {
    argPos.push(prev);
    args.push(compiler.subStr(prev));
    prev = compiler.pos + 1;
  };
  while (!compiler.isFinish()) {
    const ch = compiler.curChar();
    if (ch === "(") {
      level++;
    } else if (ch === ")") {
      if (level === 0) break;
      level--;
    } else if (ch === "," && level === 0) {
      addArg();
    }
    compiler.pos++;
  }
  if (compiler.isFinish())
    compiler.error("It is necessary to close the bracket", { pos: p0 - 1 });
  if (p0 !== compiler.pos) {
    addArg();
  }
  compiler.pos++;
  return { args, argPos };
};
