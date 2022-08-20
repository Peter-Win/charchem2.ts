import { Int } from "../../types";
import { ChemCompiler, CompilerState } from "../ChemCompiler";
import { isSpace } from "../parse/isSpace";
import { stateAgentSpace } from "./stateAgentSpace";
import { ChemNode } from "../../core/ChemNode";
import { ChemAtom } from "../../core/ChemAtom";
import { findElement } from "../../core/PeriodicTable";
import { scanId } from "../parse/scanId";
import { stateAgentMid } from "./stateAgentMid";
import { scanInt } from "../parse/scanInt";

const onReferenceError = (
  compiler: ChemCompiler,
  ref: string,
  pos: Int
): never => compiler.error("Invalid node reference '[ref]'", { ref, pos });

const useRef = (compiler: ChemCompiler, node: ChemNode) => {
  const { curBond } = compiler;
  if (curBond) {
    curBond.soft = false;
    curBond.nodes[1] = node;
    compiler.chainSys.bondToRef(curBond);
  } else {
    compiler.chainSys.addNode(node);
    compiler.nodesBranch.onNode(node);
  }
  compiler.curNode = node;
  compiler.nodesBranch.onNode(node);
};

const useRefByNumber = (compiler: ChemCompiler, n: Int, startPos: Int) => {
  const { nodes } = compiler.curAgent!;
  const index: Int = n < 0 ? nodes.length + n : n - 1;
  if (index < 0 || index >= nodes.length) {
    onReferenceError(compiler, String(n), startPos);
  }
  useRef(compiler, nodes[index]!);
};

const isAtomNode = (node: ChemNode, atom: ChemAtom): boolean =>
  node.items.length === 1 && node.items[0]!.obj === atom;

const useRefByAtom = (
  compiler: ChemCompiler,
  atom: ChemAtom,
  startPos: Int
) => {
  const { nodes } = compiler.curAgent!;
  useRef(
    compiler,
    nodes.find((it) => isAtomNode(it, atom)) ??
      onReferenceError(compiler, atom.id, startPos)
  );
};

const useRefById = (compiler: ChemCompiler, id: string, startPos: Int) => {
  const ref = compiler.references[id];
  if (ref) {
    useRef(compiler, ref);
  } else {
    const elem = findElement(id);
    if (elem) {
      useRefByAtom(compiler, elem, startPos);
    } else {
      onReferenceError(compiler, id, startPos);
    }
  }
};

export const stateNodeRef: CompilerState = (compiler) => {
  if (isSpace(compiler.curChar())) {
    return compiler.setState(stateAgentSpace);
  }
  const startPos = compiler.pos;
  const n = scanInt(compiler);
  if (n !== undefined) {
    useRefByNumber(compiler, n, startPos);
  } else {
    const id = scanId(compiler);
    if (id) {
      useRefById(compiler, id, startPos);
    } else onReferenceError(compiler, compiler.curChar(), startPos);
  }
  return compiler.setState(stateAgentMid);
};
