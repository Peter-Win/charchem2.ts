import { ChemObj } from "../core/ChemObj";
import { ChemExpr } from "../core/ChemExpr";
import { ChemAgent } from "../core/ChemAgent";
import { ChemNode } from "../core/ChemNode";
import { ChemNodeItem } from "../core/ChemNodeItem";
import { isEmptyNode } from "../core/isEmptyNode";
import { ChemCustom } from "../core/ChemCustom";
import { ChemK } from "../core/ChemK";
import { ChemCharge } from "../core/ChemCharge";
import { makeChargeText } from "../core/makeChargeText";
import { ElemList } from "../core/ElemList";
import { makeElemList } from "./makeElemList";

export const makeBrutto = (
  expr: ChemObj,
  ignoreAgentK: boolean = false
): ChemExpr => {
  const result = new ChemExpr();
  const agent = new ChemAgent();
  result.entities.push(agent);
  const node = agent.addNode(new ChemNode());
  const elemList: ElemList = makeElemList(expr, ignoreAgentK);
  elemList.sortByHill();
  elemList.list.forEach((elemRec) => {
    const item = elemRec.elem ?? new ChemCustom(elemRec.id);
    if (!isEmptyNode(item)) {
      node.items.push(new ChemNodeItem(item, new ChemK(elemRec.n)));
    }
  });
  if (elemList.charge !== 0.0) {
    node.charge = new ChemCharge(
      makeChargeText(elemList.charge),
      elemList.charge
    );
  }
  return result;
};
