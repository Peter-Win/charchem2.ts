import { CompilerState } from "../ChemCompiler";
import { scanCoeff } from "../parse/scanCoeff";
import { ifDef } from "../../utils/ifDef";
import { startMul } from "../main/multipier";
import { stateAgentMid } from "./stateAgentMid";

export const stateBracketBegin: CompilerState = (compiler) => {
  ifDef(scanCoeff(compiler), (it) => {
    startMul(compiler, it, true);
  });
  return compiler.setState(stateAgentMid);
};
