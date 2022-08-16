import { BondAlign } from "../../core/ChemBond";
import { ChemCompiler } from "../ChemCompiler";

const aligns = { r: 1, R: 1, l: 1, L: 1, m: 1, M: 1 };

export const funcDblAlign = (
  compiler: ChemCompiler,
  args: string[]
  // @Suppress("UNUSED_PARAMETER") pos: List<Int>
) => {
  compiler.varAlign =
    args[0]! in aligns ? (args[0]![0]!.toLowerCase() as BondAlign) : undefined;
};
