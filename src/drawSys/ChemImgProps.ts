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

  bracketSubKY = 0.7; // Аналогично subKY, но для скобок

  supKY = 0.5; // Разница между верхом надстрочного символа и верхом объекта В долях xHeight символа!

  bracketSupKY = 0.7; // Аналогично supKY, но для скобок

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

  bracketSpace = 0; // Шаг между соседними скобками )( или ][ или )[

  useTextBrackets: boolean = true;

  electronDotD = 0; // Диаметр точки для структур Льюиса

  constructor(
    stdStyle: TextProps,
    line: number = 0,
    hline: number = 0,
    width: number = 0
  ) {
    this.stdStyle = stdStyle;
    if (!this.stdStyle.style.fill) this.stdStyle.style.fill = "black";
    this.line = line;
    this.horizLine = hline;
    this.lineWidth = width;
  }

  // Функция вызывается после заполнения части свойств для автоматического заполнения остальных свойств
  init() {
    // Длина связи вычисляется из высоты стандартного шрифта
    const me = this;
    me.line = me.line || getFontHeight(me.stdStyle.font.getFontFace()) * 1.6;
    const { line } = me;

    // Ширина линии определяется по длине связи с использованием коэффициента
    me.lineWidth = me.lineWidth || Math.ceil(line / me.kw);
    const { lineWidth } = me;

    // Длина мягкой связи (по оси Х) вычисляется из ширины знака + (потому что минус может быть слишком короткий)
    me.horizLine = me.horizLine || me.stdStyle.font.getTextWidth("+");

    me.thickWidth = me.thickWidth || lineWidth * 4;
    me.chiralWidth = me.chiralWidth || lineWidth * 5;
    me.hatch = me.hatch || lineWidth * 2;
    me.dash = me.dash || lineWidth * 3;
    me.lineSpace2 = me.lineSpace2 || lineWidth * 2;
    me.lineSpace2x = me.lineSpace2x || lineWidth * 3;
    me.lineSpace3 = me.lineSpace3 || lineWidth * 2;
    me.arrowL = me.arrowL || line / 5;
    me.arrowD = me.arrowD || line / 9;
    me.opSpace = me.opSpace || line / 4;
    me.agentKSpace = me.agentKSpace || lineWidth * 2;

    me.bracketWidth = me.bracketWidth || lineWidth * 4;
    me.bracketSpace = me.bracketSpace || lineWidth * 2;
    me.electronDotD = me.electronDotD || lineWidth * 3;

    if (me.nodeMargin < 0) me.nodeMargin = me.lineWidth || 1;
  }

  getStyle(styleName: ChemStyleId): TextProps {
    return this.styles[styleName] || this.stdStyle;
  }

  getStyleColored(styleName: ChemStyleId, color?: string): TextProps {
    const style = this.getStyle(styleName);
    if (!color || style.style.fill === color) {
      return style;
    }
    return {
      ...style,
      style: { ...style.style, fill: color },
    };
  }

  // Стили, требующие уменьшения.
  static getIndexStyles(): ChemStyleId[] {
    return [
      "itemCount",
      "itemMass",
      "nodeCharge",
      "oxidationState",
      "bracketCharge",
      "bracketCount",
    ];
  }
}
