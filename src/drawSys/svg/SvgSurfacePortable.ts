import { LocalFontProps, LocalFont } from "../AbstractSurface";
import { SvgFont } from "../portableFonts/svgFont/SvgFont";
import { SvgSurface } from "./SvgSurface";
import { LocalSvgFont } from "./LocalSvgFont";

export class SvgSurfacePortable extends SvgSurface {
  glbFonts: Record<string, SvgFont> = {};

  constructor(private stdGlobalFont: SvgFont) {
    super();
  }

  addGlbFont(name: string, glbFont: SvgFont) {
    this.glbFonts[name] = glbFont;
  }

  /*
Пока что поиск подходящего шрифта происходит не честно.
Теоретически надо было бы анализировать font-face, weight, italic и т.п.
Но пока что используется упрощенный вариант:
  Поле family из LocalFontProps считается именем глобального шрифта.
То есть, в стилях, которые используются ChemImgProps, указывается не font-family, а точное имя.
Например, вместо Roboto будет указано точное имя Roboto-Regular.
Поэтому нет нужды анализировать другие характеристики шрифта.
"Честный" вариант подразумевал бы для всех шрифтов семейства указывать Roboto, Но учитывать другие характеристики.
*/
  getFont(props: LocalFontProps): LocalFont {
    const glbFont = this.glbFonts[props.family] ?? this.stdGlobalFont;
    return new LocalSvgFont(glbFont, props);
  }
}
