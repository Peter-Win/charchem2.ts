import { CompilerState } from "../ChemCompiler";
import { skipSpaces } from "../parse/skipSpaces";
import { stateAgentMid } from "./stateAgentMid";

export const stateAgentSpace: CompilerState = (compiler) => {
  skipSpaces(compiler);
  return compiler.setState(stateAgentMid);
};
