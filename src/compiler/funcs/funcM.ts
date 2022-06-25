import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";

export const funcM = (compiler: ChemCompiler, args: string[], pos: Int[]) => {
  if (args.length > 0) {
    compiler.varMass = parseNum(compiler, args[0]!, pos[0]!);
  }
};
