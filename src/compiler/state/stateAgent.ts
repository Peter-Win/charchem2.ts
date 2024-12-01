import { CompilerState } from "../ChemCompiler";
import { createAgent } from "../main/agent";
import { stateAgentBegin } from "./stateAgentBegin";

export const stateAgent: CompilerState = (compiler) => {
  createAgent(compiler);
  compiler.agentMode = "begin";
  return compiler.setState(stateAgentBegin);
};
