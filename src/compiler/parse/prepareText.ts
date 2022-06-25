import { ChemCompiler } from "../ChemCompiler";
import { mainPreProcess } from "../preprocessor/mainPreProcess";

export const prepareText = (compiler: ChemCompiler) => {
  const src0 = `${compiler.srcText} `;
  const src = mainPreProcess(src0);
  compiler.text = src;
  compiler.expr.src0 = src0;
  compiler.expr.src = src;
};
