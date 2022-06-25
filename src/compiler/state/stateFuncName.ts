import { CompilerState } from "../ChemCompiler";
import { scanTo } from "../parse/scan";
import { scanArgs } from "../parse/scanArgs";
import { ifDef } from "../../utils/ifDef";
import { stateAgentMid } from "./stateAgentMid";
import { funcsDict } from "../funcs/funcsDict";

export const stateFuncName: CompilerState = (compiler) => {
  const startPos = compiler.pos; // Указывает на следующий символ за $
  if (!scanTo(compiler, "("))
    compiler.error("Expected '(' after [S]", { S: "$", pos: startPos - 1 });
  const name = compiler.subStr(startPos);
  compiler.pos++;
  const { args, argPos } = scanArgs(compiler);
  // Если имя функции не найдено, функция игнорируется
  // с целью совместимости со следующими версиями
  ifDef(funcsDict[name], (func) => func(compiler, args, argPos));
  return compiler.setState(stateAgentMid);
};
