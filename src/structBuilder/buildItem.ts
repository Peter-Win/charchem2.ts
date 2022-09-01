import { ChemNodeItem } from "../core/ChemNodeItem";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { ChemImgProps, TextProps } from "../drawSys/ChemImgProps";
import { drawText } from "./drawText";
import { Rect } from "../math/Rect";
import { drawTextNear } from "./drawTextNear";
import { getTextInternalRect } from "./getTextInternalRect";
import { Figure } from "../drawSys/figures/Figure";
import { drawTextWithMarkup } from "./drawTextWithMarkup";

interface BuildItemResult {
  itemFrame: FigFrame;
  figText?: Figure;
  rcCore?: Rect;
}

export const buildItem = (
  item: ChemNodeItem,
  imgProps: ChemImgProps,
  color: string
): BuildItemResult => {
  const itemFrame = new FigFrame();
  const itemColor = item.color ?? color;
  const { fig, rcCore } = item.walkExt({
    fig: undefined as Figure | undefined,
    rcCore: undefined as Rect | undefined,
    onText(text: string, style: TextProps) {
      const txFig = drawText(itemFrame, text, style);
      this.fig = txFig;
      this.rcCore = getTextInternalRect(txFig);
    },
    onMarkup(textWithMarkup: string, style: TextProps) {
      const { fig: figM, irc } = drawTextWithMarkup(
        textWithMarkup,
        imgProps,
        style
      );
      itemFrame.addFigure(figM, true);
      this.fig = figM;
      this.rcCore = irc;
    },

    atom(obj) {
      this.onText(
        obj.id,
        imgProps.getStyleColored("atom", item.atomColor ?? itemColor)
      );
    },
    radical(obj) {
      this.onText(obj.label, imgProps.getStyleColored("radical", itemColor));
    },
    comment(obj) {
      this.onMarkup(obj.text, imgProps.getStyleColored("comment", itemColor));
    },
    custom(obj) {
      this.onMarkup(obj.text, imgProps.getStyleColored("custom", itemColor));
    },
    comma() {
      this.onText(",", imgProps.getStyleColored("comma", itemColor));
    },
  });
  if (rcCore) {
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
  return { itemFrame, figText: fig, rcCore };
};
