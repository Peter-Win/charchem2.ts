import { ChemNodeItem } from "../core/ChemNodeItem";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { ChemImgProps, TextProps } from "../drawSys/ChemImgProps";
import { drawText } from "./drawText";
import { Rect } from "../math/Rect";
import { drawTextNear } from "./drawTextNear";
import { getTextInternalRect } from "./getTextInternalRect";
import { Figure } from "../drawSys/figures/Figure";
import { drawTextWithMarkup } from "./drawTextWithMarkup";
import { drawLewisShell } from "./drawLewisShell";
import { FigEllipse } from "../drawSys/figures/FigEllipse";
import { Point } from "../math/Point";
import { LocalFont } from "../drawSys/AbstractSurface";
import { ChemStyleId } from "../drawSys/ChemStyleId";
import { CoeffPos } from "../types/CoeffPos";
import { locateAtomNumber } from "../inspectors/locateAtomNumber";
import { ifDef } from "../utils/ifDef";

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
  const { color } = item;
  let itemFont: LocalFont | undefined;
  const { fig, rcCore } = item.walkExt({
    fig: undefined as Figure | undefined,
    rcCore: undefined as Rect | undefined,
    onText(text: string, style: TextProps) {
      const txFig = drawText(itemFrame, text, style);
      this.fig = txFig;
      this.rcCore = getTextInternalRect(txFig);
      itemFont = style.font;
    },
    onMarkup(textWithMarkup: string, style: TextProps) {
      itemFont = style.font;
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
    const drawIndex = (value: unknown, styleName: ChemStyleId, pos: CoeffPos) =>
      drawTextNear({
        frame: itemFrame,
        rcCore,
        text: String(value),
        imgProps,
        style: imgProps.getStyleColored(styleName, item.color),
        pos,
      });

    const { atomNum, n, charge, mass, dots } = item;
    if (n.isSpecified()) {
      drawIndex(n.toString(), "itemCount", "RB");
    }
    if (charge) {
      drawIndex(charge.text, "oxidationState", "CU");
    }
    ifDef(mass, (it) => drawIndex(it, "itemMass", "LT"));
    ifDef(atomNum, (it) => {
      const atomNumber = it === "" ? locateAtomNumber(item) : it;
      if (atomNumber !== undefined) drawIndex(atomNumber, "atomNumber", "LB");
    });
    if (dots) {
      const rc = rcCore.clone();
      if (itemFont) {
        rc.B.y -= (itemFont as LocalFont).getFontFace().descent;
        rc.B.y -= imgProps.lineWidth;
      }
      const radius = imgProps.electronDotD / 2;
      const pr = new Point(radius, radius);
      rc.grow(imgProps.lineWidth + radius);
      drawLewisShell(rc, dots, imgProps, ({ p, color: dotColor }) => {
        const figDot = new FigEllipse(p, pr, {
          fill: dotColor || color || imgProps.stdStyle.style.fill,
        });
        figDot.bounds.grow(imgProps.lineWidth);
        itemFrame.addFigure(figDot);
      });
    }
    // TODO: dashes
  }
  itemFrame.update();
  return { itemFrame, figText: fig, rcCore };
};
