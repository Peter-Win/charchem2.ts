import { ChemNode } from "../../core/ChemNode";
import { ChemBond } from "../../core/ChemBond";
import { ChemBracketBegin, ChemBracketEnd } from "../../core/ChemBracket";
import { ChemObj } from "../../core/ChemObj";
import { AgentCmd } from "./AgentCmd";
import { AgentCmdBrClose } from "./AgentCmdBrClose";
import { AgentCmdBrOpen } from "./AgentCmdBrOpen";
import { AgentCmdNode } from "./AgentCmdNode";
import { AgentCmdSoftBond } from "./AgentCmdSoftBond";
import { ChemMul, ChemMulEnd } from "../../core/ChemMul";
import { createAgentCmdMul } from "./AgentCmdMul";
import { ChemAgent } from "../../core/ChemAgent";

export const createAgentCmd = (
  obj: ChemObj,
  agent: ChemAgent
): AgentCmd | undefined => {
  if (obj instanceof ChemBond) {
    if (obj.soft) return new AgentCmdSoftBond(obj, agent);
  } else if (obj instanceof ChemBracketBegin) {
    return new AgentCmdBrOpen(obj);
  } else if (obj instanceof ChemBracketEnd) {
    return new AgentCmdBrClose(obj);
  } else if (obj instanceof ChemMul) {
    return createAgentCmdMul(obj);
  } else if (obj instanceof ChemNode) {
    return new AgentCmdNode(obj);
  } else if (obj instanceof ChemMulEnd) {
    return undefined;
  }
  return new AgentCmd();
};
