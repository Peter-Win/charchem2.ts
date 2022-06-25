import { CompilerState } from "../ChemCompiler";
import { addNodeItem } from "../main/addNodeItem";
import { createComment } from "../parse/comment";
import { stateAgentMid } from "./stateAgentMid";

export const stateCommentIn: CompilerState = (compiler) => {
  addNodeItem(compiler, createComment(compiler));
  return compiler.setState(stateAgentMid);
};
