import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";

export const funcL = (compiler: ChemCompiler, args: string[], pos: Int[]) => {
  compiler.varLength =
    args.length === 0 ? 1.0 : parseNum(compiler, args[0]!, pos[0]!);
};
