import { ChemChargeOwner } from "../../core/ChemChargeOwner";
import { CompilerState } from "../ChemCompiler";
import { openNode } from "../main/node";
import { scanCharge } from "../parse/scanCharge";
import { stateAgentMid } from "./stateAgentMid";

export const stateCharge: CompilerState = (compiler) => {
  const { pos, curNode, curBond } = compiler;
  // Если нет явно объявленного владельца, то можно постараться создать автоузел
  const chargeOwner: ChemChargeOwner =
    compiler.chargeOwner ??
    (!curNode && curBond
      ? openNode(compiler, true)
      : compiler.error("Expected node declaration before charge", {
          pos: pos - 1,
        }));
  // Наличие ` перед объявлением заряда означает, что заряд нужно вывести слева
  const isLeft = compiler.getAltFlag();
  const varPos = compiler.eject("varPos");
  chargeOwner.charge =
    scanCharge(compiler, varPos ?? (isLeft ? "LT" : "RT")) ??
    compiler.error("Invalid charge declaration", { pos });
  return compiler.setState(stateAgentMid);
};
