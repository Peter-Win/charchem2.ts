import { CompilerState } from "../ChemCompiler";
import { scanCharge } from "../parse/scanCharge";
import { stateAgentMid } from "./stateAgentMid";

export const stateCharge: CompilerState = (compiler) => {
  const { pos } = compiler;
  const chargeOwner =
    compiler.chargeOwner ??
    compiler.error("Expected node declaration before charge", { pos: pos - 1 });
  // Наличие ` перед объявлением заряда означает, что заряд нужно вывести слева
  const isLeft = compiler.getAltFlag();
  chargeOwner.charge =
    scanCharge(compiler, isLeft) ??
    compiler.error("Invalid charge declaration", { pos });
  return compiler.setState(stateAgentMid);
};
