import { Rect } from "../../math/Rect";
import { Point } from "../../math/Point";
import { getNodeCenterPos, NodeInfo } from "../NodeInfo";
import { PAgentCtx } from "./PAgentCtx";
import { ifDef } from "../../utils/ifDef";

export const findAgentCenter = (ctx: PAgentCtx): Point =>
  calcExplicitCenter(findExplicitlyCentred(ctx.nodesInfo)) ??
  findDefaultCenter(ctx.nodesInfo, ctx.agentFrame.bounds) ??
  ctx.agentFrame.bounds.center;

export const findExplicitlyCentred = (allNodesInfo: NodeInfo[]): NodeInfo[] =>
  allNodesInfo.filter(({ node }) => node.bCenter);

export const calcExplicitCenter = (
  expNodesInfo: NodeInfo[]
): Point | undefined => {
  const centers: Point[] = expNodesInfo.map((ni) => getNodeCenterPos(ni));
  if (centers.length === 0) {
    return undefined;
  }
  if (centers.length === 1) {
    return centers[0]!;
  }
  const summa = centers.reduce((acc, p) => acc.iadd(p), new Point());
  return summa.times(1 / centers.length);
};

const findDefaultCenter = (
  nodesInfo: NodeInfo[],
  rect: Rect
): Point | undefined =>
  ifDef(findDefaultY(nodesInfo), (y) => new Point(rect.center.x, y));

export const findDefaultY = (nodesInfo: NodeInfo[]): number | undefined => {
  // Алгоритм: найти наибольшее количество узлов с одинаковым y
  // Если таких несколько, то взять из них среднее
  const dict: Record<number, number> = {};
  let maxCount = 0;
  nodesInfo.forEach((ni) => {
    // Ключом является значение y, округленное до сотых
    const y = Math.round(getNodeCenterPos(ni).y * 100);
    const count = (dict[y] ?? 0) + 1;
    dict[y] = count;
    maxCount = Math.max(count, maxCount);
  });
  let cy = 0;
  let n = 0;
  Object.entries(dict).forEach(([y, count]) => {
    if (count === maxCount) {
      cy += +y;
      n++;
    }
  });
  return n ? cy / 100 / n : undefined;
};
