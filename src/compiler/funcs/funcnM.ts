// Масса следующего элемента плюс атомный номер   238 #  #
// Например $nM(238)U                                 #  #
//                                                 92  ##
// Или можно $nM(1,0){n}

import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { funcM } from "./funcM";

export const funcnM = (compiler: ChemCompiler, args: string[], pos: Int[]) => {
  funcM(compiler, args, pos);
  // "" означает, что надо использовать массу того атома, к которому применяется функция
  // в отличие от undefined, который означает, что номер элемента вообще не выводится
  compiler.varAtomNumber = args.length > 1 ? cvt(args[1]!) : "";
};

const cvt = (s: string): number | undefined => {
  if (!s) return undefined;
  const n = +s;
  return Number.isNaN(n) ? undefined : n;
};
