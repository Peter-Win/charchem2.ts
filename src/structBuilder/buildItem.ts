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
  imgProps: ChemImgProps
): BuildItemResult => {
  const itemFrame = new FigFrame();
  itemFrame.label = "item";
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
        imgProps.getStyleColored("atom", item.atomColor ?? item.color)
      );
    },
    radical(obj) {
      this.onText(obj.label, imgProps.getStyleColored("radical", item.color));
    },
    comment(obj) {
      this.onMarkup(obj.text, imgProps.getStyleColored("comment", item.color));
    },
    custom(obj) {
      this.onMarkup(obj.text, imgProps.getStyleColored("custom", item.color));
    },
    comma() {
      this.onText(",", imgProps.getStyleColored("comma", item.color));
    },
  });
  if (rcCore) {
    if (item.n.isSpecified()) {
      drawTextNear({
        frame: itemFrame,
        rcCore,
        text: item.n.toString(),
        imgProps,
        style: imgProps.getStyleColored("itemCount", item.color),
        pos: "RB",
      });
    }
    if (item.charge) {
      drawTextNear({
        frame: itemFrame,
        rcCore,
        text: item.charge.text,
        imgProps,
        style: imgProps.getStyleColored("oxidationState", item.color),
        pos: "CU",
      });
    }
    // TODO: dots, dashes
  }
  itemFrame.update();
  return { itemFrame, figText: fig, rcCore };
};
