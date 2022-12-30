import { CompilerState } from "../ChemCompiler";
import { createComment } from "../parse/comment";
import { stateBegin } from "./stateBegin";

export const stateCommentPre: CompilerState = (compiler) => {
  compiler.preCommPos = compiler.pos - 1;
  compiler.preComm = createComment(compiler);
  return compiler.setState(stateBegin);
};
