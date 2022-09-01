import { CommonFontFace, FontFaceBBox } from "../CommonFontFace";

export const scaleFontFace = (
  src: CommonFontFace,
  scale: number
): CommonFontFace => {
  const dst: CommonFontFace = { ...src };

  dst.ascent *= scale;
  dst.descent *= scale;
  dst.capHeight *= scale;
  dst.xHeight *= scale;
  const { bbox } = src;
  if (bbox) dst.bbox = bbox.map((v) => v * scale) as FontFaceBBox;

  return dst;
};
