import { SvgFontGlyph } from "./SvgFontTypes";
import { CommonFontFace } from "../../CommonFontFace";
import { XmlAttrs } from "../../../utils/xml/xmlTypes";
import { lightXmlParser } from "../../../utils/xml/lightXmlParser";
import { createFontFace } from "../../utils/createFontFace";
import {
  getBaseline as getFontBaseline,
  getFontHeight,
} from "../../utils/fontFaceProps";
import { parseKern } from "./utils/parseKern";
import { kernKey } from "./kernKey";
import { Matrix2x3 } from "../../../math/Matrix2x3";

export class SvgFont {
  readonly fontFace: CommonFontFace;

  readonly codeMap: Record<string, SvgFontGlyph>;

  readonly nameMap: Record<string, SvgFontGlyph>;

  constructor(
    public readonly id: string,
    fontFace: CommonFontFace,
    public readonly glyphs: SvgFontGlyph[],
    codeMap: Record<string, SvgFontGlyph>,
    nameMap: Record<string, SvgFontGlyph>,
    public readonly kernMap: Record<string, number>,
    public readonly missingGlyph?: SvgFontGlyph
  ) {
    this.fontFace = Object.freeze(fontFace);
    this.codeMap = codeMap;
    this.nameMap = nameMap;
  }

  getBaseline(): number {
    return getFontBaseline(this.fontFace);
  }

  getHeight(): number {
    return getFontHeight(this.fontFace);
  }

  // eslint-disable-next-line class-methods-use-this
  getTransform = () => new Matrix2x3([1, 0, 0, -1, 0, 0]);

  /**
   * This is the most typical and fastest way to get a list of glyphs that match the original text.
   * But there may be more complex ways. For example, searching for ligatures. Or using alternate glyphs.
   * Therefore, the final rendering works with a list of glyphs.
   * @param text
   * @returns
   */
  textToGlyphs(text: string): SvgFontGlyph[] {
    return Array.from(text)
      .map((char) => this.codeMap[char] ?? this.missingGlyph!)
      .filter((g) => !!g);
  }

  traceGlyphs(
    glyphs: SvgFontGlyph[],
    onGlyph?: (x: number, g: SvgFontGlyph) => void
  ): number {
    return glyphs.reduce((x: number, g: SvgFontGlyph, i: number) => {
      if (onGlyph) onGlyph(x, g);
      const next = glyphs[i + 1];
      let nextX = x + g.dx;
      if (next) {
        nextX -= this.kernMap[kernKey(g.name, next.name)] || 0;
      }
      return nextX;
    }, 0);
  }

  static create(xmlCode: string): SvgFont {
    let fontId = "";
    let fontDx = 0;
    let missingGlyph: SvgFontGlyph | undefined;
    let fontFace: CommonFontFace | null = null;
    const glyphs: SvgFontGlyph[] = [];
    const codeMap: Record<string, SvgFontGlyph> = {};
    const nameMap: Record<string, SvgFontGlyph> = {};
    const kernMap: Record<string, number> = {};
    const createGlyph = (attrs: XmlAttrs) => {
      const name = attrs["glyph-name"] || attrs.unicode;
      if (!name) return; // ignore glyph without a name
      const glyph: SvgFontGlyph = {
        name,
        code: attrs.unicode,
        d: attrs.d,
        dx: +(attrs["horiz-adv-x"] || 0) || fontDx,
      };
      glyphs.push(glyph);
      if (glyph.code) codeMap[glyph.code] = glyph;
      nameMap[name] = glyph;
    };
    lightXmlParser(xmlCode, (tag: string, attrs: XmlAttrs) => {
      switch (tag) {
        case "font":
          fontId = attrs.id || "";
          fontDx = +(attrs["horiz-adv-x"] || 0);
          break;
        case "font-face":
          fontFace = createFontFace(attrs);
          break;
        case "glyph":
          createGlyph(attrs);
          break;
        case "hkern":
          parseKern(attrs, codeMap, nameMap, kernMap);
          break;
        case "missing-glyph":
          missingGlyph = {
            name: "",
            d: attrs.d,
            dx: +(attrs["horiz-adv-x"] || 0),
          };
          break;
        default:
          break;
      }
    });
    if (!fontFace) {
      throw new Error("FontFace not found");
    }
    return new SvgFont(
      fontId,
      fontFace,
      glyphs,
      codeMap,
      nameMap,
      kernMap,
      missingGlyph
    );
  }
}
