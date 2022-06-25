import { CompilerState } from "../ChemCompiler";
import { agentAnalyse } from "../main/agentAnalyse";
import { closeEntity } from "../main/entity";
import { stateBegin } from "./stateBegin";

export const stateAgentMid: CompilerState = (compiler) =>
  agentAnalyse(compiler, () => {
    closeEntity(compiler);
    return compiler.setState(stateBegin);
  });
