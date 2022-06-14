import { LocalFontProps, LocalFont } from "../AbstractSurface";
import { SvgFont } from "../portableFonts/svgFont/SvgFont";
import { SvgSurface } from "./SvgSurface";
import { LocalSvgFont } from "./LocalSvgFont";

export class SvgSurfacePortable extends SvgSurface {
  constructor(private fontFactory: SvgFont) {
    super();
  }

  getFont(props: LocalFontProps): LocalFont {
    return new LocalSvgFont(this.fontFactory, props);
  }
}
