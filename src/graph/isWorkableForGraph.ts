import { ChemAgent } from "../core/ChemAgent";
import { ChemExpr } from "../core/ChemExpr";

export const isWorkableForGraph = (
  exprOrAgent: ChemExpr | ChemAgent
): boolean => {
  if (exprOrAgent instanceof ChemExpr) {
    if (!exprOrAgent.isOk()) return false;
    const agents = exprOrAgent.getAgents();
    return (
      agents.length > 0 && !agents.find((agent) => !isWorkableForGraph(agent))
    );
  }
  const v = exprOrAgent.walkExt({
    isStop: false as boolean,
    comma() {
      this.isStop = true;
    },
    itemPre(obj) {
      if (obj.n.isAbstract()) {
        this.isStop = true;
      }
    },
    bracketEnd(obj) {
      if (obj.n.isAbstract()) {
        this.isStop = true;
      }
    },
  });
  return !v.isStop;
};
