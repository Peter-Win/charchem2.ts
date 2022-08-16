import { ChemBond } from "../../core/ChemBond";
import { drawBond } from "../bond/drawBond";
import { PAgentCtx } from "./PAgentCtx";

export const drawAllBonds = (ctx: PAgentCtx) => {
  const { agent, props, agentFrame, nodesInfo } = ctx;
  agent.commands.forEach((cmd) => {
    if (cmd instanceof ChemBond) {
      drawBond({
        bond: cmd,
        props,
        frame: agentFrame,
        nodesInfo,
        stA: agent.stA,
      });
    }
  });
};
