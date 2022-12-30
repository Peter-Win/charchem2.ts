import { CompilerState } from "../ChemCompiler";
import { createComment } from "../parse/comment";
import { stateBegin } from "./stateBegin";

export const stateOpEnd: CompilerState = (compiler) => {
  if (compiler.curChar() === '"') {
    compiler.pos++;
    compiler.curOp!.commentPost = createComment(compiler);
  }
  if (compiler.curOp) {
    compiler.addSrcMapItem(compiler.curOp, compiler.eject("entityBegin"));
  }
  return compiler.setState(stateBegin);
};
