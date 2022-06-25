import { CompilerState } from "../ChemCompiler";
import { createComment } from "../parse/comment";
import { stateBegin } from "./stateBegin";

export const stateCommentPre: CompilerState = (compiler) => {
  compiler.preComm = createComment(compiler);
  return compiler.setState(stateBegin);
};
