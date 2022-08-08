import { ChemCompiler } from "../ChemCompiler";
import { ChemBond } from "../../core/ChemBond";
import { ChemNode } from "../../core/ChemNode";
import { ChemBracketEnd } from "../../core/ChemBracket";
import { closeNode, openNode } from "./node";
import { lastItem } from "../../utils/lastItem";
import { removeItem } from "../../utils/removeItem";
import { applyMiddlePoints } from "./middlePoint";

export const createCommonBond = (compiler: ChemCompiler): ChemBond => {
  const bond = new ChemBond();
  bond.color = compiler.varColor;
  return bond;
};

export const changeBondToHard = (compiler: ChemCompiler, bond: ChemBond) => {
  bond.soft = false;
  compiler.chainSys.changeBondToHard(bond);
};

export const bindNodeToBond = (
  compiler: ChemCompiler,
  node: ChemNode,
  chemBond: ChemBond
) => {
  compiler.curNode = node;

  chemBond.nodes[1] = node;
  const node0 = chemBond.nodes[0];
  const auto0: boolean = node0?.autoMode ?? false;
  // Если хотя бы один узел автоматический, то связь не мягкая
  if (chemBond.soft && (auto0 || node.autoMode)) {
    changeBondToHard(compiler, chemBond);
  }
  if (chemBond.soft) {
    compiler.nodesBranch.onSubChain();
    compiler.nodesBranch.onNode(node);
  }
  compiler.curBond = undefined;
  // Для жесткой связи можно вычислить координаты второго узла относительно первого
  const { dir } = chemBond;
  if (dir && node0 && !chemBond.soft && !dir.isZero()) {
    node.pt = node0.pt.plus(dir);
  }
};

export const bindNodeToCurrentBond = (
  compiler: ChemCompiler,
  node?: ChemNode
) => {
  const { curBond } = compiler;
  if (curBond) {
    bindNodeToBond(compiler, node ?? openNode(compiler, true), curBond);
  }
};

export const findBondBetweenNodes = (
  compiler: ChemCompiler,
  nodeA: ChemNode,
  nodeB: ChemNode
): ChemBond | undefined =>
  compiler.curAgent!.bonds.find((it) => {
    const { nodes } = it;
    return (
      !it.middlePoints &&
      nodes.length === 2 &&
      ((nodes[0] === nodeA && nodes[1] === nodeB) ||
        (nodes[0] === nodeB && nodes[1] === nodeA))
    );
  });

export const getNodeForBondStart = (
  compiler: ChemCompiler,
  bond?: ChemBond
): ChemNode => {
  const { curNode } = compiler;
  if (curNode) {
    // Если текущий узел есть, то использовать его
    return curNode;
  }
  // Возможна ситуация, когда связь стыкуется к ранее закрытой скобке
  const lastCmd = lastItem(compiler.curAgent!.commands);
  const bracketEnd: ChemBracketEnd | undefined =
    lastCmd instanceof ChemBracketEnd ? lastCmd : undefined;
  if (bracketEnd) {
    const { nodeIn } = bracketEnd;
    if (nodeIn) {
      bracketEnd.bond = bond;
      return nodeIn;
    }
  }
  return openNode(compiler, true);
};

// Предполагается, что свойства bond уже заполнены. В первую очередь: dir, n, soft
export const onOpenBond = (compiler: ChemCompiler, bond: ChemBond) => {
  const oldNode = getNodeForBondStart(compiler, bond);
  closeNode(compiler);
  applyMiddlePoints(compiler, bond);
  if (bond.n === 2.0 && !bond.align) {
    bond.align = compiler.varAlign;
  }
  bond.nodes[0] = oldNode;
  if (bond.isAuto && oldNode.autoMode) {
    // Если первый узел простой связи является автоматическим, то связь не мягкая
    bond.soft = false;
  }
  bond.color = compiler.varColor;
  /*
    Здесь нельзя делать предположений о том, какой будет узел на другом конце.
    Хотя вектор уже известен, но далее может появиться ссылка и связь может стать переходной.
     */
  compiler.curAgent!.addBond(bond);
  compiler.curBond = bond;
  compiler.chainSys.addBond(bond);
};

export const mergeBonds = (
  compiler: ChemCompiler,
  oldBond: ChemBond,
  newBond: ChemBond,
  newNode: ChemNode
) => {
  // При наложении связей от новой только добавляется кратность.
  // Остальные характеристики значения не имеют
  oldBond.n += newBond.n;
  compiler.curNode = newNode;
  compiler.curBond = oldBond;
  // TODO: Возможно, здесь стоило бы пометить newBond, что его нельзя корректировать
  newBond.soft = false;
  newBond.nodes[1] = newNode;
  compiler.chainSys.addBond(newBond);
  removeItem(compiler.curAgent!.bonds, newBond);
  removeItem(compiler.curAgent!.commands, newBond);
};
