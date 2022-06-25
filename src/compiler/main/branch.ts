import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { StackItem } from "./StackItem";
import { ChemNode } from "../../core/ChemNode";
import { ChemBond } from "../../core/ChemBond";
import { closeNode } from "./node";
import { bindNodeToCurrentBond, getNodeForBondStart } from "./bondCommon";
import { stateAgentMid } from "../state/stateAgentMid";

export class BranchDecl extends StackItem {
  constructor(
    pos: Int,
    public readonly node: ChemNode,
    public readonly bond?: ChemBond
  ) {
    super(pos);
  }

  // eslint-disable-next-line class-methods-use-this
  override msgInvalidClose() {
    return "It is necessary to close the branch";
  }
}

// Указатель установлен на символ < или * для случая (*
export const openBranch = (compiler: ChemCompiler): Int => {
  const curNode: ChemNode = getNodeForBondStart(compiler, undefined);
  compiler.push(new BranchDecl(compiler.pos, curNode, compiler.curBond));
  compiler.chainSys.onBranchBegin();
  compiler.nodesBranch.onBranchBegin();
  return compiler.setState(stateAgentMid, 1);
};

export const closeBranch = (compiler: ChemCompiler): Int => {
  const decl = compiler.pop();
  if (decl) {
    if (decl instanceof BranchDecl) {
      bindNodeToCurrentBond(compiler, compiler.curNode);
      closeNode(compiler);

      compiler.curNode = decl.node;
      compiler.chainSys.onBranchEnd();
      compiler.nodesBranch.onBranchEnd();
      compiler.chainSys.setCurNode(decl.node);

      return compiler.setState(stateAgentMid, 1);
    }
    // Ошибка: ветка закрывается до того, как закрыта скобка...
    compiler.error("Cant close branch before bracket", {
      pos: compiler.pos,
      pos0: decl.pos + 1,
    });
  }
  return compiler.error("Invalid branch close", { pos: compiler.pos });
};

export const checkBranch = (compiler: ChemCompiler) => {
  const it = compiler.pop();
  if (it) {
    compiler.error(it.msgInvalidClose(), { pos: it.pos });
  }
};
