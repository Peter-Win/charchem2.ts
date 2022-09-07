import { FontWeight } from "../../FontTypes";
import { LocalFontProps } from "../../AbstractSurface";
import { BBoxIndex, FontFaceBBox } from "../../CommonFontFace";
import { webFontWeight } from "./webFontWeight";
import { isBold } from "../../utils/fontWeightValue";
import { traceBox } from "./traceBox";
import { WebFontProps } from "../WebFontProps";
import { createLocalFontHash } from "../../utils/createLocalFontHash";

export const makeCanvasFontProp = (props: {
  fontFamily: string;
  cssHeight: number;
  italic: boolean;
  bold: boolean;
}): string => {
  const { fontFamily, cssHeight, bold, italic } = props;
  const fontStyleChunks = [`${cssHeight}px`, fontFamily];
  if (bold) fontStyleChunks.unshift("bold");
  if (italic) fontStyleChunks.unshift("italic");
  return fontStyleChunks.join(" ");
};

/**
 * For browser only
 * @param props
 * @returns
 */
export const makeWebFontProps = (props: LocalFontProps): WebFontProps => {
  const fontFamily = props.family;
  const fontWeight: FontWeight = webFontWeight(props.weight);
  const italic: boolean = props.style === "italic" || props.style === "oblique";
  const cssHeight = Math.round(props.height);
  const vOffset = Math.round(cssHeight / 2);
  const testHeight = cssHeight + 2 * vOffset;
  const testWidth = Math.round(cssHeight / 2);
  const baseline = vOffset + cssHeight;

  const bold = isBold(fontWeight);
  const canvasFont = makeCanvasFontProp({
    fontFamily,
    cssHeight,
    bold,
    italic,
  });

  // This code can throw exception, if run in Node or old browser.
  const canvas = document.createElement("canvas");
  canvas.height = testHeight;
  canvas.width = testWidth;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas is not supported");
  ctx.fillStyle = "#FFF";
  ctx.textBaseline = "alphabetic";
  ctx.font = canvasFont;
  const m = ctx.measureText("[lj");
  const mZ = ctx.measureText("Z");
  const mz = ctx.measureText("z");

  const trace = (letter: string, toBottom: boolean): number => {
    ctx.clearRect(0, 0, testWidth, testHeight);
    ctx.fillText(letter, 0, baseline);
    const info = ctx.getImageData(0, 0, testWidth, testHeight);
    if (!info) throw Error("Cant access to image data");
    const best = traceBox(info.data, testWidth, testHeight, toBottom);
    return best || (toBottom ? 0 : testHeight - 1);
  };
  const xHeight = mZ.actualBoundingBoxAscent ?? baseline - trace("Z", true);
  const capHeight = mz.actualBoundingBoxAscent ?? baseline - trace("z", true);
  const ascent = m.actualBoundingBoxAscent ?? baseline - trace("l", true);
  const descent = m.actualBoundingBoxDescent
    ? -m.actualBoundingBoxDescent
    : baseline - trace("j", false);
  const bbox: FontFaceBBox = [0, 0, 0, 0];
  bbox[BBoxIndex.bottom] = m.fontBoundingBoxDescent
    ? -m.fontBoundingBoxDescent
    : descent;
  bbox[BBoxIndex.top] = m.fontBoundingBoxAscent ?? Math.max(xHeight, ascent);

  canvas.remove();

  return {
    hash: createLocalFontHash(props),
    fontFace: {
      fontFamily,
      fontWeight,
      fontStyle: italic ? "italic" : "normal",
      xHeight,
      capHeight,
      descent,
      ascent,
      bbox,
    },
    canvasFont,
    fontFamily,
    cssHeight,
    italic,
    bold,
  };
};
