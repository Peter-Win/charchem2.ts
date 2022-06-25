import { ChemCompiler } from "../ChemCompiler";
import { Int } from "../../types";
import { scanId } from "../parse/scanId";
import { getNodeForced } from "./node";
import { stateAgentMid } from "../state/stateAgentMid";

// Condition of call: compiler.curChar() == ':'
export const createLabel = (compiler: ChemCompiler): Int => {
  compiler.pos++;
  const it = scanId(compiler);
  if (it) {
    compiler.references[it] = getNodeForced(compiler, true);
  } else compiler.error("Invalid label", { pos: compiler.pos });
  return compiler.setState(stateAgentMid);
};
