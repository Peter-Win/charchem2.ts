import { Matrix2x3 } from "../../math/Matrix2x3";
import { Point } from "../../math/Point";
import {
  AbstractSurface,
  LocalFont,
  LocalFontProps,
  TextStyle,
} from "../AbstractSurface";
import { CommonFontFace, FontFaceBBox } from "../CommonFontFace";
import { SvgFont } from "../portableFonts/svgFont/SvgFont";
import { SvgSurface } from "./SvgSurface";
import { makeGlyphId } from "./svgUtils/makeGlyphId";
import { drawTag } from "../../utils/xml/drawTag";
import { scaleFontFace } from "../utils/scaleFontFace";

export class LocalSvgFont implements LocalFont {
  private factory: SvgFont;

  private fontFace: CommonFontFace;

  private transform: Matrix2x3;

  private scale: number;

  constructor(factory: SvgFont, props: LocalFontProps) {
    this.factory = factory;
    const originHeight = factory.getHeight();
    const scale = props.height / originHeight;
    this.scale = scale;
    this.fontFace = scaleFontFace(factory.fontFace, scale);
    // this.fontFace = {
    //   ...factory.fontFace,
    // };
    // this.fontFace.ascent *= scale;
    // this.fontFace.descent *= scale;
    // this.fontFace.capHeight *= scale;
    // this.fontFace.xHeight *= scale;
    // const { bbox } = factory.fontFace;
    // if (bbox) this.fontFace.bbox = bbox.map((v) => v * scale) as FontFaceBBox;

    this.transform = factory.getTransform();
    this.transform.scale(scale);
  }

  getFontFace(): CommonFontFace {
    return this.fontFace;
  }

  getTextWidth(textLine: string): number {
    const glyphList = this.factory.textToGlyphs(textLine);
    const rawWidth = this.factory.traceGlyphs(glyphList);
    return rawWidth * this.scale;
  }

  drawLine(
    surface: AbstractSurface,
    org: Point,
    textLine: string,
    style: TextStyle
  ) {
    if (surface instanceof SvgSurface) {
      const transform = this.transform.clone();
      transform.translate(org);
      const glyphList = this.factory.textToGlyphs(textLine);
      const startX = transform.e;
      this.factory.traceGlyphs(glyphList, (x, g) => {
        transform.e = startX + x * this.scale;
        if (g.d) {
          const glyphId = makeGlyphId(this.factory, g);
          if (!surface.defs[glyphId]) {
            const def = drawTag("path", { id: glyphId, d: g.d }, true);
            surface.addDef(glyphId, def);
          }
          const figure = drawTag(
            "use",
            {
              "xlink:href": `#${glyphId}`,
              transform: `matrix(${transform.repr()})`,
              fill: style.fill,
            },
            true
          );
          surface.addFigure(figure);
        }
      });
      return;
    }
    throw new Error("Expected SvgSurface");
  }
}
