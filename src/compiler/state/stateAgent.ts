import { CompilerState } from "../ChemCompiler";
import { createAgent } from "../main/agent";
import { scanCoeff } from "../parse/scanCoeff";
import { ifDef } from "../../utils/ifDef";
import { stateAgentIn } from "./stateAgentIn";

export const stateAgent: CompilerState = (compiler) => {
  const agent = createAgent(compiler);

  // TODO: Пока нет множителей, используем упрощенное предположение, что коэффициент только один
  ifDef(scanCoeff(compiler), (coeff) => {
    agent.n = coeff;
  });

  return compiler.setState(stateAgentIn);
};
