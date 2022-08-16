import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { ChemNode } from "../../core/ChemNode";
import { getNodeForced } from "./node";
import { createCommonBond } from "./bondCommon";

export const findRingNodes = (
  compiler: ChemCompiler
): (ChemNode | undefined)[] | undefined => {
  const curNode = getNodeForced(compiler, true);
  const nodesFull = compiler.nodesBranch.nodes;
  const nodes = nodesFull.slice(0, nodesFull.length - 1);
  const j = nodes.lastIndexOf(curNode);
  return j < 0 ? undefined : nodes.slice(j);
};

export const findRingNodesEx = (
  compiler: ChemCompiler
): (ChemNode | undefined)[] =>
  findRingNodes(compiler) ??
  compiler.error("Cant close ring", { pos: compiler.pos - 2 });

export const createRingBond = (compiler: ChemCompiler, deltaPos: Int) => {
  compiler.pos += deltaPos;
  const bond = createCommonBond(compiler);
  bond.nodes = findRingNodesEx(compiler);
  bond.n = 1.0;
  bond.tx = "o";
  bond.ext = "o";
  bond.isCycle = true;
  compiler.curAgent!.addBond(bond);
  compiler.curBond = undefined;
};
