import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { ChemAgent } from "../../core/ChemAgent";
import { ChemK } from "../../core/ChemK";
import { onCreateEntity, closeEntity } from "./entity";
import { addNodeItem } from "./addNodeItem";
import { closeNode, openNode, updateAutoNode } from "./node";
import { checkMul, startMul } from "./multipier";
import { checkBranch, closeBranch } from "./branch";
import { scanCoeff } from "../parse/scanCoeff";
import { checkMiddlePoints } from "./middlePoint";
import { stateAgentMid } from "../state/stateAgentMid";
import { ChemBackground } from "../../core/ChemBackground";

export const createAgent = (compiler: ChemCompiler): ChemAgent => {
  let { pos } = compiler;
  const { preComm } = compiler;
  closeEntity(compiler);
  const agent = new ChemAgent();
  agent.part = compiler.curPart;
  compiler.curAgent = agent;
  onCreateEntity(compiler, agent);
  if (preComm) {
    pos = compiler.eject("preCommPos") ?? pos;
    addNodeItem(compiler, preComm);
  }
  compiler.references = {};
  compiler.varMass = undefined;
  compiler.curWidth = 0;
  compiler.centralNode = false;
  compiler.varPadding = [];
  compiler.varDots = undefined;
  compiler.nodesBranch.onSubChain();
  compiler.bracketsCtrl.clear();
  if (compiler.srcMap) {
    compiler.entityBegin = pos;
  }
  return agent;
};

export const closeChain = (compiler: ChemCompiler) => {
  const { curBond } = compiler;
  if (curBond) {
    if (curBond.nodes.length === 2 && !curBond.nodes[1]) {
      openNode(compiler, true);
    }
  }
  compiler.curBond = undefined;
  closeNode(compiler);
  compiler.chainSys.closeChain();
  compiler.nodesBranch.onSubChain();
  compiler.bracketsCtrl.clear();
};

export const onCloseAgent = (compiler: ChemCompiler) => {
  const { curAgent } = compiler;
  if (curAgent) {
    checkMul(compiler);
    checkMiddlePoints(compiler);
    closeChain(compiler);
    compiler.curAgent = undefined;
    compiler.getAltFlag();
    compiler.curBond = undefined;
    checkBranch(compiler);
    finalUpdateBondsForNodes(curAgent);
    finalUpdateAutoNodes(curAgent);
    if (compiler.background) {
      curAgent.commands.push(new ChemBackground(compiler.background));
    }
    compiler.background = undefined;
    curAgent.bonds.forEach((b, i) => {
      b.index = i;
    });
    compiler.addSrcMapItem(curAgent, compiler.entityBegin);
    compiler.agentMode = undefined;
  }
};

export const star = (compiler: ChemCompiler): Int => {
  compiler.pos++;
  if (compiler.curChar() === ")") {
    return closeBranch(compiler);
  }
  checkMul(compiler);
  startMul(compiler, scanCoeff(compiler) ?? new ChemK(1), false);
  return compiler.setState(stateAgentMid);
};

export const finalUpdateBondsForNodes = (agent: ChemAgent) => {
  // update bonds field for all nodes
  agent.walk({
    bond(obj) {
      obj.nodes.forEach((it) => it?.addBond(obj));
    },
  });
};

export const finalUpdateAutoNodes = (agent: ChemAgent) => {
  agent.walk({
    nodePre(obj) {
      if (obj.autoMode) {
        updateAutoNode(obj);
      }
    },
  });
};
