import { ChemCompiler } from "../ChemCompiler";
import { ChemNodeItem } from "../../core/ChemNodeItem";
import { lastItem } from "../../utils/lastItem";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export const closeItem = (compiler: ChemCompiler) => {};

export const getLastItem = (compiler: ChemCompiler): ChemNodeItem | undefined =>
  lastItem(compiler.curNode?.items);
