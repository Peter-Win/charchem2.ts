import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { ChemNode } from "../../core/ChemNode";
import { findElement } from "../../core/PeriodicTable";

export const findNode = (
  compiler: ChemCompiler,
  ref: string
): ChemNode | undefined => {
  const { nodes } = compiler.curAgent!;
  const n = +ref;
  if (!Number.isNaN(n)) {
    return nodes[n < 0 ? n + nodes.length : n - 1];
  }
  // Возможно, метка...
  // Если была указана метка, совпадающая с обозначением элемента, то метка имеет приоритет выше
  const node = compiler.references[ref];
  if (node) return node;

  // если указан элемент
  const elem = findElement(ref);
  if (elem) {
    const elemNode = nodes.find(
      (it) => it.items.length === 1 && it.items[0]!.obj === elem
    );
    if (elemNode) return elemNode;
  }
  return undefined;
};

export const findNodeEx = (
  compiler: ChemCompiler,
  ref: string,
  pos: Int
): ChemNode => {
  const node = findNode(compiler, ref);
  if (!node) compiler.error("Invalid node reference '[ref]'", { ref, pos });
  return node;
};
