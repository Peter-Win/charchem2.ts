/**
 * Свойства для отрисовки графической формулы
 * Могут быть использованы многократно
 * Created by PeterWin on 13.05.2017.
 */

import { LocalFont, TextStyle } from "./AbstractSurface";
import { getFontHeight } from "./utils/fontFaceProps";
import { ChemStyleId } from "./ChemStyleId";

export interface TextProps {
  font: LocalFont;
  style: TextStyle;
}

export class ChemImgProps {
  stdStyle: TextProps;

  styles = {} as Record<ChemStyleId, TextProps | undefined>;

  line: number; // Длина 2D-химической связи (от центра до центра)

  horizLine: number; // Длина 1D-химической связи (от края до края)

  lineWidth: number; // Толщина обычной линии. Если 0, значит минимальная толщина (обычно 1px).

  thickWidth = 0; // Толщина толстой линии

  chiralWidth = 0; // Макс. толщина хиральной связи w/d

  lineSpace2 = 0; // Отступ между двойными линиями (между краями ##..##)

  lineSpace2x = 0; // Для пересекающейся двойной связи

  lineSpace3 = 0; // Отсуп между тройными линиями

  subKY = 0.5; // Разница между низом подстрочного символа и низом объекта В долях xHeight подстрочного символа!

  bracketSubKY = 0.3; // Аналогично subKY, но для скобок

  supKY = 0.5; // Разница между верхом надстрочного символа и верхом объекта В долях xHeight символа!

  bracketSupKY = 0.3; // Аналогично supKY, но для скобок

  hatch = 0; // абсолютное расстояние между штрихами в изображении связи типа /d (z<0) -- see getHatch()

  dash = 0; // Длина штриха линии типа S:

  arrowL = 0; // длина стрелки

  arrowD = 0; // ширина половинки стрелки

  opSpace = 0; // Расстояние по оси X между агентом и операцией: H2 + O2

  agentKSpace = 0; // гориз отступ коэффициента агента

  mulChar = "\u00b7";

  kw = 40; // Коэффициент для вычисления lineWidth = ceil(line/kw)

  flDblAlign = true; // Смещение двойной связи к центру, если возможно.

  nodeMargin = -1; // Отступ химической связи для узла с текстом

  bracketWidth = 0; // Ширина скобки

  useTextBrackets: boolean = true;

  constructor(
    stdStyle: TextProps,
    line: number = 0,
    hline: number = 0,
    width: number = 0
  ) {
    this.stdStyle = stdStyle;
    this.line = line;
    this.horizLine = hline;
    this.lineWidth = width;
  }

  // Функция вызывается после заполнения части свойств для автоматического заполнения остальных свойств
  init() {
    // Длина связи вычисляется из высоты стандартного шрифта
    const me = this;
    me.line = me.line || getFontHeight(me.stdStyle.font.getFontFace()) * 1.2;
    const { line } = me;

    // Ширина линии определяется по длине связи с использованием коэффициента
    me.lineWidth = me.lineWidth || Math.ceil(line / me.kw);
    const { lineWidth } = me;

    // Длина мягкой связи (по оси Х) вычисляется из ширины знака + (потому что минус может быть слишком короткий)
    me.horizLine = me.horizLine || me.stdStyle.font.getTextWidth("+");

    me.thickWidth = me.thickWidth || lineWidth * 4;
    me.chiralWidth = me.chiralWidth || lineWidth * 6;
    me.hatch = me.hatch || lineWidth * 3;
    me.dash = me.dash || lineWidth * 3;
    me.lineSpace2 = me.lineSpace2 || lineWidth * 2;
    me.lineSpace2x = me.lineSpace2x || lineWidth * 3;
    me.lineSpace3 = me.lineSpace3 || lineWidth * 2;
    me.arrowL = me.arrowL || line / 6;
    me.arrowD = me.arrowD || line / 10;
    me.opSpace = me.opSpace || line / 10;
    me.agentKSpace = me.agentKSpace || lineWidth;

    me.bracketWidth = me.bracketWidth || lineWidth * 4;

    if (me.nodeMargin < 0) me.nodeMargin = me.lineWidth || 1;
  }

  getStyle(styleName: ChemStyleId): TextProps {
    return this.styles[styleName] || this.stdStyle;
  }

  getStyleColored(styleName: ChemStyleId, color?: string): TextProps {
    const realColor = color ?? this.stdStyle.style.fill;
    const style = this.getStyle(styleName);
    return style.style.fill === realColor
      ? style
      : { ...style, style: { ...style.style, fill: realColor } };
  }
}
