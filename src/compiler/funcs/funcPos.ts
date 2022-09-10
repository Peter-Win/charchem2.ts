import { CoeffPos, rxCoeffPos } from "../../types/CoeffPos";
import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";

export const funcPos = (compiler: ChemCompiler, args: string[], pos: Int[]) => {
  const arg = args[0];
  if (!arg) return;
  if (rxCoeffPos.test(arg)) {
    compiler.varPos = arg as CoeffPos;
  } else {
    compiler.varPos = parseNum(compiler, arg, pos[0]!);
  }
};
