import { ChemCompiler } from "../ChemCompiler";
import { ChemK } from "../../core/ChemK";
import { ChemMul, ChemMulEnd } from "../../core/ChemMul";
import { closeNode } from "./node";

export const startMul = (
  compiler: ChemCompiler,
  k: ChemK,
  isFirst: boolean
) => {
  const mul = new ChemMul(k, isFirst, compiler.varColor);
  closeNode(compiler);
  compiler.chainSys.closeSubChain();
  compiler.curAgent!.commands.push(mul);
  compiler.mulCounter.create(mul);
};

export const stopMul = (compiler: ChemCompiler, mul: ChemMul) => {
  compiler.mulCounter.close();
  compiler.curAgent!.commands.push(new ChemMulEnd(mul));
};

export const checkMulBeforeBracket = (compiler: ChemCompiler) => {
  const it = compiler.mulCounter.getMulForBracket();
  if (it) {
    stopMul(compiler, it);
  }
};

export const checkMul = (compiler: ChemCompiler) => {
  const it = compiler.mulCounter.getMulForced();
  if (it) {
    stopMul(compiler, it);
  }
};
