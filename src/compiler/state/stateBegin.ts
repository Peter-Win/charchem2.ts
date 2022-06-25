import { CompilerState } from "../ChemCompiler";
import { createChemOp } from "../main/chemOp";
import { scanOp } from "../parse/scanOp";
import { skipSpaces } from "../parse/skipSpaces";
import { stateAgent } from "./stateAgent";
import { stateCommentPre } from "./stateCommentPre";
import { stateOpEnd } from "./stateOpEnd";

export const stateBegin: CompilerState = (compiler) => {
  skipSpaces(compiler);
  if (compiler.isFinish()) {
    return 0;
  }

  if (compiler.curChar() === '"') {
    return compiler.setState(stateCommentPre, 1);
  }

  const opDef = scanOp(compiler);
  if (opDef != null) {
    createChemOp(compiler, opDef);
    return compiler.setState(stateOpEnd);
  }

  // Иначе считаем, что это начало реагента
  return compiler.setState(stateAgent);
};
