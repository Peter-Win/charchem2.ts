import { ChemCompiler } from "../ChemCompiler";
import { ChemK } from "../../core/ChemK";
import { ChemMul, ChemMulEnd } from "../../core/ChemMul";
import { closeNode, openNode } from "./node";
import { ifDef } from "../../utils/ifDef";

export const startMul = (
  compiler: ChemCompiler,
  k: ChemK,
  isFirst: boolean
) => {
  const mul = new ChemMul(k, isFirst, compiler.varColor);
  const { curNode, curBond } = compiler;
  // Если нет узла, но есть связь, то надо создать автоузел, закрывающий связь.
  mul.nodes[0] = curNode || ifDef(curBond, () => openNode(compiler, true));

  closeNode(compiler);
  compiler.chainSys.closeSubChain();
  compiler.curAgent!.commands.push(mul);
  compiler.mulCounter.create(mul);
  compiler.bracketsCtrl.clear();
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
