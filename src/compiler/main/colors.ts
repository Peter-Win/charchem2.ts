import { ChemCompiler } from "../ChemCompiler";
import { ifDef } from "../../utils/ifDef";

export const getItemColor = (compiler: ChemCompiler): string | undefined =>
  ifDef(compiler.varItemColor1, (it) => {
    compiler.varItemColor1 = undefined;
    return it;
  }) ??
  compiler.varItemColor ??
  compiler.varColor;

export const getAtomColor = (compiler: ChemCompiler): string | undefined =>
  ifDef(compiler.varAtomColor1, (it) => {
    compiler.varAtomColor1 = undefined;
    return it;
  }) ?? compiler.varAtomColor;
