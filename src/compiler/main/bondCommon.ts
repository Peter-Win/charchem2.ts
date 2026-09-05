import { ChemCompiler } from "../ChemCompiler";
import { ChemBond } from "../../core/ChemBond";
import { ChemNode } from "../../core/ChemNode";
import { ChemBracketBegin, ChemBracketEnd } from "../../core/ChemBracket";
import { closeNode, openNode } from "./node";
import { lastItem } from "../../utils/lastItem";
import { removeItem } from "../../utils/removeItem";
import { applyMiddlePoints } from "./middlePoint";
import { BracketDecl } from "./BracketDecl";

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
  chemBond: ChemBond,
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
  node?: ChemNode,
) => {
  const { curBond } = compiler;
  if (curBond) {
    bindNodeToBond(compiler, node ?? openNode(compiler, true), curBond);
  }
};

export const findBondBetweenNodes = (
  compiler: ChemCompiler,
  nodeA: ChemNode,
  nodeB: ChemNode,
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
  bond?: ChemBond,
): ChemNode => {
  const { curNode } = compiler;
  if (curNode) {
    // Если текущий узел есть, то использовать его
    return curNode;
  }
  // Возможна ситуация, когда связь стыкуется к ранее закрытой скобке
  const { lastStackItem } = compiler;
  const { commands } = compiler.curAgent!;

  const lastCmd = lastItem(commands);
  if (
    lastCmd instanceof ChemBracketEnd &&
    lastStackItem instanceof BracketDecl &&
    lastCmd.begin === lastStackItem.begin
  ) {
    if (lastCmd.isBranchBracket) {
      const node0 = lastCmd.begin.nodes[0];
      if (node0) {
        return node0;
      }
    } else {
      const { nodeIn } = lastCmd;
      if (nodeIn) {
        lastCmd.bond = bond;
        return nodeIn;
      }
    }
  }

  // Branch Brackets. Case of R(=
  if (lastCmd instanceof ChemBracketBegin && bond?.isHorizontal()) {
    const prevNode = commands[commands.length - 2];
    bond.soft = true; // Это не работает. т.к. создаётся автоузел и связь считается не мягкой
    if (prevNode instanceof ChemNode && !prevNode.autoMode) {
      lastCmd.isBranchBracket = true;
      lastCmd.bond = bond;
      return prevNode;
    }
    if (prevNode instanceof ChemBracketEnd && prevNode.isBranchBracket) {
      // case: -S(=O)(=O)-OH  (second bracket)
      const { begin } = prevNode;
      const beginIndex = commands.indexOf(begin);
      if (beginIndex >= 0) {
        const prevBond = commands[beginIndex + 1];
        if (prevBond instanceof ChemBond) {
          const n0 = prevBond.nodes[0];
          if (n0) {
            lastCmd.isBranchBracket = true;
            lastCmd.bond = bond;
            return n0;
          }
        }
      }
    }
  }

  return openNode(compiler, true);
};

// Предполагается, что свойства bond уже заполнены. В первую очередь: dir, n, soft
export const onOpenBond = (
  compiler: ChemCompiler,
  bond: ChemBond,
  begin: number,
) => {
  if (compiler.srcMap) {
    compiler.srcMap.push({ begin, end: compiler.pos, obj: bond });
  }
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
  newNode: ChemNode,
) => {
  // При наложении связей от новой только добавляется кратность.
  // Остальные характеристики значения не имеют
  oldBond.n += newBond.n;
  compiler.curNode = newNode;
  compiler.curBond = oldBond;
  // узел фиксируется, чтобы его не сместило при автокоррекции
  newNode.fixed = true;
  newBond.isAuto = false;
  newBond.soft = false;
  newBond.nodes[1] = newNode;

  // Конечные координаты отрезка должны совпадать со старой связью.
  // Но направление может поменяться т.к. это имеет значение для отрисовки следующих связей
  const [nbn0, nbn1] = newBond.nodes;
  if (nbn0 && nbn1) {
    newBond.dir = nbn1.pt.minus(nbn0.pt);
  }

  compiler.chainSys.addBond(newBond);
  removeItem(compiler.curAgent!.bonds, newBond);
  removeItem(compiler.curAgent!.commands, newBond);
};
