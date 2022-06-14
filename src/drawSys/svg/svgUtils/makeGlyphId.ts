import { SvgFont } from "../../portableFonts/svgFont/SvgFont";
import { SvgFontGlyph } from "../../portableFonts/svgFont/SvgFontTypes";

export const makeGlyphId = (font: SvgFont, glyph: SvgFontGlyph): string =>
  `${font.id}-${glyph.name}`;
