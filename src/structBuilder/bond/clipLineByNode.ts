import { Double } from "../../types";
import { Point } from "../../math/Point";
import { ChemNode } from "../../core/ChemNode";
import { isEmptyNode } from "../../core/isEmptyNode";
import { ResultBuildNode } from "../buildNode";
import { clipLine } from "./clipLine";

export const clipLineByNode = (
  node: ChemNode,
  nodeRes: ResultBuildNode,
  a: Point | undefined,
  b: Point | undefined,
  margin: Double
): Point | undefined => {
  if (!a || !b) return undefined;
  const result = a.clone();
  if (node.autoMode) return result;
  // Нет смысла отсекать пустой узел - автоматический или состоящий из пустого коммента или абстрактного элемента
  if (isEmptyNode(node)) return result;
  const { nodeFrame, rcNodeCore } = nodeRes;
  // Нужно перевести координаты отсекающих фигур в координаты агента...
  const rect = rcNodeCore.clone();
  rect.grow(margin);
  rect.move(nodeFrame.org);

  return clipLine(rect, a, b);
};
