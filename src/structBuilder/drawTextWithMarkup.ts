import { FigFrame } from "../drawSys/figures/FigFrame";
import { MarkupChunk, MarkupProps, parseMarkupChunk } from "../utils/markup";
import { TextProps } from "../drawSys/ChemImgProps";
import { Figure } from "../drawSys/figures/Figure";
import { Rect } from "../math/Rect";
import { FigText } from "../drawSys/figures/FigText";
import { isClose } from "../math";
import {
  LocalFont,
  LocalFontProps,
  TextStyle,
} from "../drawSys/AbstractSurface";
import { StructBuilderCtx } from "./StructBuilderCtx";
import { globalizeMarkupChunk } from "../utils/markup/globalizeMarkupChunk";

export interface ResultTextWithMarkup {
  fig: Figure;
  irc: Rect;
}

interface ParamsDrawMarkup {
  chunk: MarkupChunk;
  font: LocalFont;
  style: TextStyle;
  scale: number;
  ctx: StructBuilderCtx;
}

const drawMarkup = ({
  chunk,
  ctx,
  font,
  style,
  scale,
}: ParamsDrawMarkup): ResultTextWithMarkup => {
  const { imgProps } = ctx;
  const irc = new Rect(0, -font.getFontFace().ascent, 0, 0);
  const fig = new FigFrame();
  fig.label = "markup";
  let xSup = 0;
  let xSub = 0;
  const updateX = () => {
    xSup = fig.bounds.right;
    xSub = xSup;
  };

  const modifiedFont = (props: Readonly<Partial<LocalFontProps>>): LocalFont =>
    ctx.getFont({ ...font.props, ...props });

  const applyFontFeatures = ({
    fontSizePt,
    bold,
    italic,
  }: MarkupProps): LocalFont => {
    // TODO: если внутри одного тега шрифта будет другой, нужно чтобы он масштабировался относительно базового размера
    const features: Partial<LocalFontProps> = {};
    if (fontSizePt && !isClose(fontSizePt, 10)) {
      features.height = 0.1 * fontSizePt * font.props.height;
    }
    if (bold) {
      features.weight = "bold";
    }
    if (italic) {
      features.style = "italic";
    }
    return Object.keys(features).length === 0 ? font : modifiedFont(features);
  };

  const applyStyle = (
    prevStyle: TextStyle,
    { underline, overline }: MarkupProps,
  ): TextStyle => ({
    ...prevStyle,
    underline,
    overline,
  });

  chunk.chunks.forEach((subChunk) => {
    if (typeof subChunk === "string") {
      const txFig = new FigText(
        subChunk,
        applyFontFeatures(chunk.props ?? {}),
        style,
      );
      txFig.org.x = fig.bounds.right;
      fig.addFigure(txFig, true);
      updateX();
      return;
    }
    const { type, color } = subChunk.props ?? {};
    if (type === "sup" || type === "sub") {
      const isSup = type === "sup";
      const newFont: LocalFont = modifiedFont({
        height: font.props.height * scale,
      });
      const ff = newFont.getFontFace();
      const height = ff.ascent - ff.descent;
      const rs = drawMarkup({
        chunk: subChunk,
        font: newFont,
        style,
        scale,
        ctx,
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
      ctx,
      font,
      style: applyStyle(newStyle, subChunk.props ?? {}),
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
  ctx: StructBuilderCtx,
  { font, style }: TextProps,
): ResultTextWithMarkup => {
  const { imgProps } = ctx;
  const stdH = imgProps.stdStyle.font.getFontFace().ascent;
  const subH = imgProps.getStyle("itemCount").font.getFontFace().ascent;
  const scale = isClose(stdH, subH) ? 0.7 : subH / stdH;
  const chunk: MarkupChunk = globalizeMarkupChunk(parseMarkupChunk(text), {});
  return drawMarkup({ ctx, chunk, font, style, scale });
};
