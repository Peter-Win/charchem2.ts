import { LocalFontProps, LocalFont } from "../AbstractSurface";
import { SvgSurface } from "../svg/SvgSurface";
import { WebFontCache } from "./WebFontCache";
import { SvgWebLocalFont } from "./SvgWebLocalFont";

export class SvgWebSurface extends SvgSurface {
  private fontPropsCache: WebFontCache;

  private fontCache: Record<string, LocalFont> = {};

  constructor(fontPropsCache?: WebFontCache) {
    super();
    this.fontPropsCache = fontPropsCache ?? new WebFontCache();
  }

  getFont(props: LocalFontProps): LocalFont {
    const webProps = this.fontPropsCache.getWebProps(props);
    const font = this.fontCache[webProps.hash];
    if (font) return font;
    const svgLocFont = new SvgWebLocalFont(webProps);
    this.fontCache[webProps.hash] = svgLocFont;
    return svgLocFont;
  }
}
