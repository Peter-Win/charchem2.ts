import { ChemImgProps, TextProps } from "../ChemImgProps";
import { rulesHtml } from "../../textRules/rulesHtml";
import { createRulesList } from "../utils/createRulesList";
import { AbstractSurface, LocalFontProps } from "../AbstractSurface";
import { FontStretch, FontStyle, FontWeight } from "../FontTypes";
import { ChemStyleId } from "../ChemStyleId";

let rulesList: [ChemStyleId, string][] | undefined;

type FnComputedStyle = (element: Element) => CSSStyleDeclaration;
const findComputedStyle: FnComputedStyle =
  document.defaultView?.getComputedStyle ||
  // @ts-ignore
  ((element: Element) => element.currentStyle);

export const createChemImgProps = (
  owner: HTMLElement,
  surface: AbstractSurface
): ChemImgProps => {
  // Система доступа к откомпилированным свойствам DOM-объектов. Используется отрисовщиком
  const span = document.createElement("span");
  const createStyle = (htmlCode: string): TextProps | undefined => {
    span.innerHTML = htmlCode;
    const elem = htmlCode[0] === "<" ? span.firstChild : span;
    if (!(elem instanceof Element)) return undefined;
    const cssStyle = findComputedStyle(elem);
    if (!cssStyle) return undefined;
    const fontProps: LocalFontProps = {
      family: cssStyle.fontFamily,
      height: +cssStyle.fontSize.slice(0, -2),
      weight: cssStyle.fontWeight as FontWeight,
      style: cssStyle.fontStyle as FontStyle,
      stretch: cssStyle.fontStretch as FontStretch,
    };
    return {
      font: surface.getFont(fontProps),
      style: { fill: cssStyle.color },
    };
  };
  try {
    owner.appendChild(span);
    const stdStyle = createStyle("A");
    if (!stdStyle) throw Error("Can't access to CSS properties");
    const props = new ChemImgProps(stdStyle);
    rulesList = rulesList || createRulesList(rulesHtml);
    rulesList.forEach(([name, code]) => {
      const curStyle = createStyle(code);
      if (curStyle) props.styles[name] = curStyle;
    });
    props.init();
    return props;
  } finally {
    span.remove();
  }
};
