import { ifDef } from "../../utils/ifDef";
import { CompilerState } from "../ChemCompiler";
import { scanCoeff } from "../parse/scanCoeff";
import { stateAgentIn } from "./stateAgentIn";
import { stateFuncName } from "./stateFuncName";

/**
 * Начало агента может включать функции и коэффициент
 * @param compiler
 * @returns
 */
export const stateAgentBegin: CompilerState = (compiler) => {
  compiler.agentMode = "begin";
  const agent = compiler.curAgent;
  if (!agent) {
    compiler.error("stateAgentBegin with empty agent", {});
  } else {
    if (compiler.curChar() === "$") {
      return compiler.setState(stateFuncName, 1);
    }

    ifDef(scanCoeff(compiler), (coeff) => {
      agent.n = coeff;
      if (coeff) coeff.color = compiler.varColor;
      if (compiler.srcMap) {
        compiler.addSrcMapItem(agent, compiler.entityBegin, "agentK");
        compiler.entityBegin = compiler.pos;
      }
    });
  }
  return compiler.setState(stateAgentIn);
};
