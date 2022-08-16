import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { ChemNode } from "../../core/ChemNode";
import { findNodeEx } from "./findNode";
import { findRingNodes } from "./bondRing";
import { ifDef } from "../../utils/ifDef";
import { lastItem } from "../../utils/lastItem";
import { getNodeForced } from "./node";
import { ArgsInfo, scanArgs } from "../parse/scanArgs";
import { makeParamsDict, setBondProperties } from "./bondUniversal";
import { createCommonBond } from "./bondCommon";

const nodesInterval = (
  compiler: ChemCompiler,
  refs: string[],
  pos: Int
): ChemNode[] => {
  const nodeA = findNodeEx(compiler, refs[0]!, pos);
  const nodeB = findNodeEx(compiler, refs[1]!, pos + refs[0]!.length + 1);
  const first = Math.min(nodeA.index, nodeB.index);
  const last = Math.max(nodeA.index, nodeB.index);
  return compiler.curAgent!.nodes.slice(first, last + 1);
};

/**
 * Список вершин, которые будут включены в сплайновую связь
 * Разделитель - точка с запятой
 * Можно указать интервал через двоеточие
 * Пример: #1:4;6
 */
export const parseNodesListDef = (
  compiler: ChemCompiler,
  value: string,
  valuePos: Int
): (ChemNode | undefined)[] | undefined => {
  if (!value) {
    return undefined;
  }
  const chunks = value.split(";");
  let curPos = valuePos;
  const nodes: ChemNode[] = chunks.reduce(
    (srcList: ChemNode[], chunk: string) => {
      const refs = chunk.split(":");
      const dstList: ChemNode[] =
        refs.length === 1
          ? [...srcList, findNodeEx(compiler, chunk, curPos)]
          : [...srcList, ...nodesInterval(compiler, refs, curPos)];

      curPos += chunk.length + 1;
      return dstList;
    },
    []
  );
  return nodes;
};

interface NodesList {
  nodes: (ChemNode | undefined)[];
  isCycle: boolean;
}

const autoLocateNodes = (compiler: ChemCompiler): NodesList =>
  ifDef(findRingNodes(compiler), (nodes) => ({ nodes, isCycle: true })) ?? {
    nodes: [...compiler.nodesBranch.nodes],
    isCycle: false,
  };

const checkCycledList = (nodes: (ChemNode | undefined)[]): NodesList =>
  nodes.length > 1 && nodes[0] === lastItem(nodes)
    ? { nodes: nodes.slice(0, nodes.length - 1), isCycle: true }
    : { nodes, isCycle: false };

export const createSplineBond = (compiler: ChemCompiler) => {
  // compiler.curChar == 's'
  compiler.pos++;
  getNodeForced(compiler, true);
  let args: ArgsInfo;
  if (compiler.curChar() !== "(") {
    args = { args: [], argPos: [] };
  } else {
    compiler.pos++;
    args = scanArgs(compiler);
  }
  const params = makeParamsDict(args.args, args.argPos);
  const bond = createCommonBond(compiler);
  bond.isCycle = false;
  bond.tx = "s";
  setBondProperties(compiler, bond, params);
  const nodes: (ChemNode | undefined)[] | undefined = ifDef(
    params["#"],
    (param) => parseNodesListDef(compiler, param.value, param.valuePos)
  );
  const nodesList: NodesList = nodes
    ? checkCycledList(nodes)
    : autoLocateNodes(compiler);
  bond.nodes = nodesList.nodes;
  bond.isCycle = "o" in params || nodesList.isCycle;
  bond.ext = "s";
  compiler.curAgent!.addBond(bond);
  compiler.curBond = undefined;
};
