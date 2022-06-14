import { CommonFontFace, FontFaceBBox } from "../CommonFontFace";

export const createFontFace = (
  attrs: Record<string, string>
): CommonFontFace => ({
  fontFamily: attrs["font-family"] || "",
  fontWeight: attrs["font-weight"] || "",
  fontStyle: attrs["font-style"],
  fontStretch: attrs["font-stretch"] || "",
  unitsPerEm: +(attrs["units-per-em"] || 0),
  panose1: attrs["panose-1"],
  ascent: +(attrs.ascent || 0),
  descent: +(attrs.descent || 0),
  xHeight: +(attrs["x-height"] || 0),
  capHeight: +(attrs["cap-height"] || 0),
  bbox: attrs.bbox ? split4(attrs.bbox) : undefined,
  underlineThickness: +(attrs["underline-thickness"] || 0),
  underlinePosition: +(attrs["underline-position"] || 0),
  unicodeRange: attrs["unicode-range"] || "",
});

const split4 = (src: string): FontFaceBBox => {
  const w = src.split(" ").map((v) => +v);
  return [w[0] || 0, w[1] || 0, w[2] || 0, w[3] || 0];
};
