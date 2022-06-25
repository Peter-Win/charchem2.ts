import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";

export const funcSlope = (
  compiler: ChemCompiler,
  args: string[],
  pos: Int[]
) => {
  compiler.varSlope =
    args.length === 0 ? 0.0 : parseNum(compiler, args[0]!, pos[0]!);
};
