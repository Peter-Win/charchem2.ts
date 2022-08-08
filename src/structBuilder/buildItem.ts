import { ChemNodeItem } from "../core/ChemNodeItem";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { ChemImgProps } from "../drawSys/ChemImgProps";
import { drawText } from "./drawText";
import { FigText } from "../drawSys/figures/FigText";
import { Rect } from "../math/Rect";
import { drawTextNear } from "./drawTextNear";
import { getTextInternalRect } from "./getTextInternalRect";

interface BuildItemResult {
  itemFrame: FigFrame;
  figText?: FigText;
  rcCore?: Rect;
}

export const buildItem = (
  item: ChemNodeItem,
  imgProps: ChemImgProps,
  color: string
): BuildItemResult => {
  const itemFrame = new FigFrame();
  const itemColor = item.color ?? color;
  const { figText } = item.walkExt({
    figText: undefined as FigText | undefined,
    atom(obj) {
      this.figText = drawText(
        itemFrame,
        obj.id,
        imgProps.getStyleColored("atom", item.atomColor ?? itemColor)
      );
    },
    radical(obj) {
      this.figText = drawText(
        itemFrame,
        obj.label,
        imgProps.getStyleColored("radical", itemColor)
      );
    },
    comment(obj) {
      this.figText = drawText(
        itemFrame,
        obj.text,
        imgProps.getStyleColored("comment", itemColor)
      );
    },
    custom(obj) {
      this.figText = drawText(
        itemFrame,
        obj.text,
        imgProps.getStyleColored("custom", itemColor)
      );
    },
    comma() {
      this.figText = drawText(
        itemFrame,
        ",",
        imgProps.getStyleColored("comma", itemColor)
      );
    },
  });
  let rcCore: Rect | undefined;
  if (figText) {
    rcCore = getTextInternalRect(figText);
    if (item.n.isSpecified()) {
      drawTextNear(
        itemFrame,
        rcCore,
        item.n.toString(),
        imgProps,
        imgProps.getStyleColored("itemCount", itemColor),
        "RB"
      );
    }
    if (item.charge) {
      drawTextNear(
        itemFrame,
        rcCore,
        item.charge.text,
        imgProps,
        imgProps.getStyleColored("oxidationState", itemColor),
        "CU"
      );
    }
    // TODO: dots, dashes
  }
  itemFrame.update();
  return { itemFrame, figText, rcCore };
};
