import { ChemBond } from "../../core/ChemBond";
import { ChemBracketBegin, ChemBracketEnd } from "../../core/ChemBracket";
import { ChemNode } from "../../core/ChemNode";
import { ChemCompiler } from "../ChemCompiler";

type RTLBracketDef = {
  beginBracket: ChemBracketBegin;
  endBracket: ChemBracketEnd;
  insideBond: ChemBond;
  insideNode: ChemNode;
  autoNodePos: number;
};

export type RightToLeftBranchBrackets = {
  brackets: RTLBracketDef[];
  outsideNode?: ChemNode;
  outsideBond?: ChemBond;
};

/**
 * Поиск ситуаций типа H2N-(O=)(S=)Te
 * Вызывается перед добавлением последнего узла
 * @param compiler
 * @returns
 */
export const checkRightToLeftBranchBrackets = (
  compiler: ChemCompiler,
): RightToLeftBranchBrackets | undefined => {
  const { curAgent } = compiler;
  if (!curAgent) return undefined;
  const { commands } = curAgent;
  let pos = commands.length - 1;
  const brackets: RTLBracketDef[] = [];

  for (;;) {
    const endBracket = commands[pos--];
    if (!(endBracket instanceof ChemBracketEnd)) break;
    if (endBracket.isBranchBracket) break;

    const autoNodePos = pos--;
    const autoNode = commands[autoNodePos];
    if (!(autoNode instanceof ChemNode) || !autoNode.autoMode) break;

    const insideBond = commands[pos--];
    // TODO: могут быть случаи скобок-веток и без внутренней связи, но о них подумаем позже
    if (!(insideBond instanceof ChemBond) || !insideBond.isHorizontal()) break;

    const insideNode = commands[pos--];
    if (!(insideNode instanceof ChemNode) || insideNode.autoMode) break;

    let beginBracket: ChemBracketBegin | undefined;
    while (pos >= 0 && !beginBracket) {
      const cmd = commands[pos--];
      if (cmd instanceof ChemBracketBegin && cmd.end === endBracket) {
        beginBracket = cmd;
      }
    }
    if (!beginBracket) return undefined;

    brackets.push({
      beginBracket,
      endBracket,
      autoNodePos,
      insideBond,
      insideNode,
    });
  }
  if (brackets.length === 0) {
    return undefined;
  }
  pos++;
  const result: RightToLeftBranchBrackets = { brackets };
  const outsideBond = commands[pos--];
  if (outsideBond instanceof ChemBond && outsideBond.isHorizontal()) {
    result.outsideBond = outsideBond;
    const outsideNode = commands[pos];
    if (outsideNode instanceof ChemNode && !outsideNode.autoMode) {
      result.outsideNode = outsideNode;
    }
  }
  return result;
};

export const makeRightToLeftBranchBrackets = (
  srcNode: ChemNode,
  params: RightToLeftBranchBrackets,
  compiler: ChemCompiler,
) => {
  const { curAgent } = compiler;
  if (!curAgent) return;
  const { commands } = curAgent;
  const { brackets, outsideBond } = params;
  brackets.forEach(({ autoNodePos, beginBracket, endBracket, insideBond }) => {
    commands.splice(autoNodePos, 1);
    beginBracket.isBranchBracket = true;
    beginBracket.bond = undefined;
    beginBracket.nodes[0] = undefined;
    endBracket.isBranchBracket = true;
    endBracket.bond = insideBond;
    insideBond.soft = true;
    insideBond.nodes[1] = srcNode;
  });
  if (outsideBond) {
    outsideBond.soft = true;
    outsideBond.nodes[1] = srcNode;
  }
};
