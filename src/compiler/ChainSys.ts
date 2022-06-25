/* eslint-disable no-param-reassign */
import { Point } from "../math/Point";
import { Int } from "../types";
import { ChemCompiler } from "./ChemCompiler";
import { ChemNode } from "../core/ChemNode";
import { ChemBond } from "../core/ChemBond";

let baseChainId = 1;
const generateChainId = (): Int => baseChainId++;

let baseSubChainId = 1;
const generateSubChainId = (): Int => baseSubChainId++;

type BondOptional = ChemBond | undefined;

export class ChainSys {
  private readonly compiler: ChemCompiler;

  constructor(compiler: ChemCompiler) {
    this.compiler = compiler;
  }

  private chainsDict: Record<Int, Set<Int>> = {};

  private subChainsDict: Record<Int, ChemNode[]> = {};

  private curChainId = 0;

  curSubChainId = 0;

  private lastBond: BondOptional;

  private stack: BondOptional[] = [];

  getLastBond(): BondOptional {
    return this.lastBond;
  }

  onBranchBegin() {
    this.stack.unshift(this.lastBond);
  }

  onBranchEnd() {
    this.lastBond = this.stack.shift();
  }

  private createChain(): Int {
    this.lastBond = undefined;
    const newChainId = generateChainId();
    this.chainsDict[newChainId] = new Set();
    return newChainId;
  }

  private getCurChain(): Set<Int> {
    if (this.curChainId === 0) {
      this.curChainId = this.createChain();
    }
    return this.chainsDict[this.curChainId]!;
  }

  private createSubChain(): Int {
    this.lastBond = undefined;
    const newId = generateSubChainId();
    this.curSubChainId = newId;
    this.subChainsDict[newId] = [];
    this.getCurChain().add(newId);
    return newId;
  }

  private getCurSubChain(): ChemNode[] {
    if (this.curSubChainId === 0) {
      this.curSubChainId = this.createSubChain();
    }
    return this.subChainsDict[this.curSubChainId]!;
  }

  addNode(node: ChemNode) {
    if (node.chain === 0) {
      this.getCurSubChain().push(node);
      node.chain = this.curChainId;
      node.subChain = this.curSubChainId;
    } else {
      this.curChainId = node.chain;
      this.curSubChainId = node.subChain;
    }
  }

  setCurNode(node: ChemNode) {
    this.curChainId = node.chain;
    this.curSubChainId = node.subChain;
  }

  addBond(bond: ChemBond) {
    if (bond.soft) {
      this.createSubChain();
    }
    this.lastBond = bond;
  }

  private mergeSubChains(dstId: Int, srcId: Int, step: Point) {
    if (dstId === srcId) {
      return;
    }
    const nodes: ChemNode[] = this.subChainsDict[srcId]!;
    nodes.forEach((it) => {
      it.subChain = dstId;
      it.pt.iadd(step);
    });
    const dstNodes = this.subChainsDict[dstId];
    if (dstNodes) nodes.forEach((it) => dstNodes.push(it));
    delete this.subChainsDict[srcId];
    if (this.curSubChainId === srcId) {
      this.curSubChainId = dstId;
    }
  }

  /**
   * scrChain присоединяется к dstChain
   */
  private mergeChains(srcNode: ChemNode, dstNode: ChemNode) {
    const srcChainId = srcNode.chain;
    const dstChainId = dstNode.chain;
    if (srcChainId !== dstChainId) {
      this.compiler
        .curAgent!.nodes.filter((it) => it.chain === srcChainId)
        .forEach((it) => {
          it.chain = dstChainId;
        });
    }
  }

  private makeTransitionBond(bond: ChemBond) {
    bond.soft = false;
    bond.dir = undefined;
    const node1 = bond.nodes[1];
    if (node1) {
      this.addNode(node1);
    }
  }

  /**
   * Связь, у которой второй узел указан через ссылку
   */
  bondToRef(bond: ChemBond) {
    const [srcNode, dstNode] = bond.nodes;
    if (!srcNode || !dstNode) {
      return;
    }
    // Если узлы принадлежат разным цепям, то нужно срастить две цепи
    const srcSubChain: Int = srcNode.subChain;
    const dstSubChain: Int = dstNode.subChain;
    if (srcSubChain !== dstSubChain) {
      // Если разные подцепи соединяются мягкой связью, то они остаются разными
      // иначе подцепи сращиваются
      if (!bond.soft) {
        // Если цепи разные, то их нужно объединить
        const srcChain: Int = srcNode.chain;
        const dstChain: Int = dstNode.chain;
        if (srcChain !== dstChain) {
          this.mergeChains(srcNode, dstNode);
          const step = dstNode.pt.minus(srcNode.pt).minus(bond.dir!);
          this.mergeSubChains(dstSubChain, srcSubChain, step);
        } else {
          // Если цепь одна, но разные подцепи, то это переходная связь
          this.makeTransitionBond(bond);
        }
      }
    } else {
      // Но если узлы в одной подцепи, то корректировать шаг связи
      bond.dir = dstNode.pt.minus(srcNode.pt);
    }
    this.compiler.curNode = dstNode;
    this.curChainId = dstNode.chain;
    this.curSubChainId = dstNode.subChain;
  }

  changeBondToHard(bond: ChemBond) {
    const dstNode = bond.nodes[0];
    if (dstNode) {
      const srcNode = bond.nodes[1];
      if (srcNode) {
        if (srcNode.chain !== dstNode.chain) {
          throw Error("Different chains");
        }
        this.mergeSubChains(
          dstNode.subChain,
          srcNode.subChain,
          bond.dir ?? new Point()
        );
      }
      this.curSubChainId = dstNode.subChain;
      this.curChainId = dstNode.chain;
    }
  }

  closeChain() {
    this.curChainId = 0;
    this.curSubChainId = 0;
    this.lastBond = undefined;
  }

  closeSubChain() {
    this.curSubChainId = 0;
    this.lastBond = undefined;
  }

  findNode(pt: Point): ChemNode | undefined {
    return this.getCurSubChain().find((it) => it.pt.equals(pt));
  }
}
