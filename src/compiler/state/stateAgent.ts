import { CompilerState } from "../ChemCompiler";
import { createAgent } from "../main/agent";
import { scanCoeff } from "../parse/scanCoeff";
import { ifDef } from "../../utils/ifDef";
import { stateAgentIn } from "./stateAgentIn";

export const stateAgent: CompilerState = (compiler) => {
  const agent = createAgent(compiler);

  ifDef(scanCoeff(compiler), (coeff) => {
    agent.n = coeff;
    if (compiler.srcMap) {
      compiler.addSrcMapItem(agent, compiler.entityBegin, "agentK");
      compiler.entityBegin = compiler.pos;
    }
  });

  return compiler.setState(stateAgentIn);
};
