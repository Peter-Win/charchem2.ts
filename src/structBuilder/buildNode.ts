import { ChemImgProps } from "../drawSys/ChemImgProps";
import { ChemNode } from "../core/ChemNode";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { buildItem } from "./buildItem";
import { Point } from "../math/Point";
import { Rect } from "../math/Rect";
import { drawCharge } from "./drawCharge";
import { isEmptyNode } from "../core/isEmptyNode";

export interface ResultBuildNode {
  nodeFrame: FigFrame;
  rcNodeCore: Rect; // in local coordinates
  center: Point; // in local coordinates (relative (0,0) of frame bounds)
}

export const buildNode = (
  node: ChemNode,
  imgProps: ChemImgProps
): ResultBuildNode | undefined => {
  if (node.autoMode || isEmptyNode(node)) {
    // auto node dont draw items. Example: /\/\
    return undefined;
  }
  const nodeFrame = new FigFrame();
  nodeFrame.label = "node";
  const centerItem = node.getCenterItem();
  let x = 0;
  let center: Point | undefined;
  let rcNodeCore: Rect | undefined;
  node.items.forEach((item) => {
    const { itemFrame, rcCore } = buildItem(item, imgProps);
    itemFrame.org.x = x - itemFrame.bounds.left;
    nodeFrame.addFigure(itemFrame);
    if (rcCore) {
      const irc = rcCore.clone();
      irc.moveXY(itemFrame.org.x, 0);
      if (item === centerItem) {
        center = irc.center;
      }
      if (!rcNodeCore) {
        rcNodeCore = irc.clone();
      } else {
        rcNodeCore.unite(irc);
      }
    }
    x += itemFrame.bounds.width;
  });
  nodeFrame.update();
  const { charge } = node;
  rcNodeCore = rcNodeCore ?? nodeFrame.bounds.clone();
  if (charge) {
    drawCharge({
      charge,
      frame: nodeFrame,
      rect: rcNodeCore,
      imgProps,
      color: node.color,
    });
  }

  center = center ?? rcNodeCore.center;
  return { nodeFrame, rcNodeCore, center };
};
