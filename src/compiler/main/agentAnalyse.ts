import { ChemCompiler } from "../ChemCompiler";
import { Int } from "../../types";
import { createSimpleBond, scanSimpleBond } from "./bondSimple";
import { closeChain, star } from "./agent";
import { createLabel } from "./createLabel";
import { closeBranch, openBranch } from "./branch";
import { addNodeItem } from "./addNodeItem";
import { instChemComma } from "../../core/ChemComma";
import { getNodeForced } from "./node";
import { stateAgentMid } from "../state/stateAgentMid";
import { stateElement } from "../state/stateElement";
import { stateCommentIn } from "../state/stateCommentIn";
import { stateCustom } from "../state/stateCustom";
import { stateAgentSpace } from "../state/stateAgentSpace";
import { stateNodeRef } from "../state/stateNodeRef";
import { stateCharge } from "../state/stateCharge";
import {
  closeBracketShort,
  openParentheses,
  openSquareBracket,
} from "./brackets";
import { stateUniBond } from "../state/stateUniBond";
import { stateFuncName } from "../state/stateFuncName";

export const agentAnalyse = (
  compiler: ChemCompiler,
  onDefault: () => Int
): Int => {
  const c = compiler.curChar();
  const bond = scanSimpleBond(compiler);
  if (bond) {
    createSimpleBond(compiler, bond);
    return compiler.setState(stateAgentMid);
  }
  if (c >= "A" && c <= "Z") {
    // Извлечь первый заглавный символ элемента. Следующие должны быть маленькими
    compiler.elementStartPos = compiler.pos;
    return compiler.setState(stateElement, 1);
  }
  switch (c) {
    case "`":
      compiler.setAltFlag();
      return compiler.setState(stateAgentMid, 1);
    case "{":
      return compiler.setState(stateCustom, 1);
    case '"':
      return compiler.setState(stateCommentIn, 1);
    case ";":
      closeChain(compiler);
      return compiler.setState(stateAgentSpace, 1);
    case ":":
      return createLabel(compiler);
    case "#":
      return compiler.setState(stateNodeRef, 1);
    case "^":
      return compiler.setState(stateCharge, 1);
    case "$":
      return compiler.setState(stateFuncName, 1);
    case "<":
      return openBranch(compiler);
    case ">":
      return closeBranch(compiler);
    case "(":
      return openParentheses(compiler);
    case "[":
      return openSquareBracket(compiler);
    case ")":
    case "]":
      return closeBracketShort(compiler);
    case "*":
      return star(compiler);
    case ",":
      return comma(compiler);
    case "_":
      return compiler.setState(stateUniBond, 1);
    case "c":
      getNodeForced(compiler, true);
      return compiler.setState(stateAgentMid, 1);

    default:
      return onDefault();
  }
};

const comma = (compiler: ChemCompiler): Int => {
  addNodeItem(compiler, instChemComma);
  return compiler.setState(stateAgentMid, 1);
};
