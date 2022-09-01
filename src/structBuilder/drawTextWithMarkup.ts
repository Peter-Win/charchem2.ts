import { FigFrame } from "../drawSys/figures/FigFrame";
import { MarkupChunk, parseMarkup } from "../utils/markup";
import { ChemImgProps, TextProps } from "../drawSys/ChemImgProps";
import { Figure } from "../drawSys/figures/Figure";
import { Rect } from "../math/Rect";
import { FigText } from "../drawSys/figures/FigText";
import { is0 } from "../math";
import { LocalFont, TextStyle } from "../drawSys/AbstractSurface";

export interface ResultTextWithMarkup {
  fig: Figure;
  irc: Rect;
}

interface ParamsDrawMarkup {
  chunk: MarkupChunk;
  imgProps: ChemImgProps;
  font: LocalFont;
  style: TextStyle;
  scale: number;
}

const drawMarkup = ({
  chunk,
  imgProps,
  font,
  style,
  scale,
}: ParamsDrawMarkup): ResultTextWithMarkup => {
  const irc = new Rect(0, -font.getFontFace().ascent, 0, 0);
  const fig = new FigFrame();
  let xSup = 0;
  let xSub = 0;
  const updateX = () => {
    xSup = fig.bounds.right;
    xSub = xSup;
  };
  chunk.chunks.forEach((subChunk) => {
    if (typeof subChunk === "string") {
      const txFig = new FigText(subChunk, font, style);
      txFig.org.x = fig.bounds.right;
      fig.addFigure(txFig, true);
      updateX();
      return;
    }
    const { type, color } = subChunk;
    if (type === "sup" || type === "sub") {
      const isSup = type === "sup";
      const newFont: LocalFont = font.createScaled
        ? font.createScaled(scale)
        : font;
      const ff = newFont.getFontFace();
      const height = ff.ascent - ff.descent;
      const rs = drawMarkup({
        chunk: subChunk,
        font: newFont,
        style,
        scale,
        imgProps,
      });
      const rsFig = rs.fig;
      if (isSup) {
        const dY = height * imgProps.supKY;
        rsFig.org.set(xSup, irc.top + ff.ascent - dY);
        xSup += rsFig.bounds.width;
      } else {
        const dY = height * imgProps.subKY;
        rsFig.org.set(xSub, irc.bottom + dY);
        xSub += rsFig.bounds.width;
      }
      fig.addFigure(rsFig, true);
      return;
    }
    const newStyle = { ...style };
    if (color) newStyle.fill = color;
    const res = drawMarkup({
      chunk: subChunk,
      imgProps,
      font,
      style: newStyle,
      scale,
    });
    res.fig.org.x = fig.bounds.right;
    fig.addFigure(res.fig, true);
    updateX();
  });
  irc.B.x = fig.bounds.right;
  return { fig, irc };
};

export const drawTextWithMarkup = (
  text: string,
  imgProps: ChemImgProps,
  { font, style }: TextProps
): ResultTextWithMarkup => {
  const stdH = imgProps.stdStyle.font.getFontFace().ascent;
  const subH = imgProps.getStyle("itemCount").font.getFontFace().ascent;
  const scale = is0(stdH - subH) ? 0.7 : subH / stdH;
  const chunk = parseMarkup(text);
  return drawMarkup({ chunk, imgProps, font, style, scale });
};
