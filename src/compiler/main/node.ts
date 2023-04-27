import { Double, Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { ChemNode } from "../../core/ChemNode";
import { ChemNodeItem } from "../../core/ChemNodeItem";
import { PeriodicTable } from "../../core/PeriodicTable";
import { ChemK } from "../../core/ChemK";
import { checkMiddlePoints } from "./middlePoint";
import {
  bindNodeToBond,
  bindNodeToCurrentBond,
  changeBondToHard,
  findBondBetweenNodes,
  mergeBonds,
} from "./bondCommon";
import { closeItem } from "./item";
import { lastItem } from "../../utils/lastItem";
import { ChemBracketEnd } from "../../core/ChemBracket";
import { createBackground } from "../../core/ChemBackground";

export const closeNode = (compiler: ChemCompiler) => {
  closeItem(compiler);
  compiler.curNode = undefined;
  compiler.chargeOwner = undefined;
};

export const openNode = (
  compiler: ChemCompiler,
  isAuto: boolean = false
): ChemNode => {
  const bond = compiler.curBond;
  if (bond) {
    const { dir } = bond;
    if (bond.soft && isAuto) {
      // if second node of bond is auto, then bond is not soft
      changeBondToHard(compiler, bond);
    }
    if (dir && !dir.isZero() && !bond.soft) {
      const pt = bond.calcPt();
      const existsNode = compiler.chainSys.findNode(pt);
      if (existsNode) {
        compiler.nodesBranch.onNode(existsNode);
        if (!bond.soft || existsNode.autoMode) {
          if (!bond.middlePoints) {
            existsNode.fixed = true; // Узел уже не может автокорректироваться, т.к. это деформирует ранее построенную структуру.
            const oldNode = bond.nodes[0]!;
            const oldBond = findBondBetweenNodes(compiler, oldNode, existsNode);
            if (oldBond) {
              mergeBonds(compiler, oldBond, bond, existsNode);
              return existsNode;
            }
          }
        }
        bindNodeToBond(compiler, existsNode, bond);
        return existsNode;
      }
    }
  }
  closeNode(compiler);
  checkMiddlePoints(compiler);
  // previous closed bracket
  {
    const cmd = lastItem(compiler.curAgent!.commands);
    if (cmd instanceof ChemBracketEnd) {
      compiler.chainSys.createSubChain();
    }
  }
  const node = compiler.curAgent!.addNode(new ChemNode());
  node.index = compiler.curAgent!.nodes.length - 1;
  node.autoMode = isAuto;

  compiler.curNode = node;
  compiler.chargeOwner = node;
  compiler.chainSys.addNode(node);
  compiler.nodesBranch.onNode(node);
  compiler.mulCounter.onNode(node);
  node.bCenter = compiler.centralNode;
  compiler.centralNode = false;

  bindNodeToCurrentBond(compiler, node);
  compiler.bracketsCtrl.onNode(node);

  if (compiler.background) {
    compiler.curAgent!.commands.push(
      createBackground(compiler.background, node)
    );
    compiler.background = undefined;
  }
  return node;
};

export const getNodeForced = (
  compiler: ChemCompiler,
  isAuto: boolean
): ChemNode => compiler.curNode ?? openNode(compiler, isAuto);

// Вызывается в самом конце, когда уже заполнен список bonds
export const updateAutoNode = (node: ChemNode) => {
  node.items.push(new ChemNodeItem(PeriodicTable.dict.C));
  const multipleSum: Double = Array.from(node.bonds).reduce(
    (sum, chemBond) => sum + chemBond.n,
    0.0
  );
  // Заряд влияет на валентность узла: carbon monoxide ⁻C≡O⁺
  const charge: Int = node.charge?.value ?? 0;
  const countH: Int = 4 + charge - Math.round(multipleSum);
  if (countH > 0) {
    node.items.push(new ChemNodeItem(PeriodicTable.dict.H, new ChemK(countH)));
  }
};
