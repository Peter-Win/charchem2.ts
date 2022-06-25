import { CompilerState } from "../ChemCompiler";
import { agentAnalyse } from "../main/agentAnalyse";

export const stateAgentIn: CompilerState = (compiler) =>
  agentAnalyse(compiler, () =>
    compiler.error("Unknown element character '[C]'", {
      C: compiler.curChar(),
      pos: compiler.pos,
    })
  );
