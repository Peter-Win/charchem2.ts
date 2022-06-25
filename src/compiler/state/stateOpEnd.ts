import { CompilerState } from "../ChemCompiler";
import { createComment } from "../parse/comment";
import { stateBegin } from "./stateBegin";

export const stateOpEnd: CompilerState = (compiler) => {
  if (compiler.curChar() === '"') {
    compiler.pos++;
    compiler.curOp!.commentPost = createComment(compiler);
  }
  return compiler.setState(stateBegin);
};
