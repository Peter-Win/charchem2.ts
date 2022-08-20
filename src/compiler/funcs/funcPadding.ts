import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";

export const funcPadding = (
  compiler: ChemCompiler,
  args: string[],
  pos: Int[]
) => {
  compiler.varPadding = args.map((arg, i) => parseNum(compiler, arg, pos[i]!));
};
