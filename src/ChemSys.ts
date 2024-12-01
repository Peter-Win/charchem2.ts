import { AutoCompileConfig } from "./browser/AutoCompileConfig";
import { renderFormulaCfg } from "./browser/renderFormulaCfg";
import { compile } from "./compiler/compile";
import { ChemExpr } from "./core/ChemExpr";
import { ChemObj } from "./core/ChemObj";
import { getVersion, getVersionStr } from "./getVersion";
import { makeBruttoKey } from "./inspectors/makeBruttoKey";
import { isAbstract } from "./inspectors/isAbstract";
import { Lang, LangParams, LocalDict } from "./lang";
import { calcMass } from "./inspectors/calcMass";
import { ChemAtom } from "./core/ChemAtom";
import { findElement } from "./core/PeriodicTable";
import { drawPeriodicTable } from "./table/drawPeriodicTable";
import { documentCompile } from "./browser/documentCompile";
import { tableRulesStd } from "./table/TableRulesStd";
import { tableRulesWide } from "./table/TableRulesWide";
import { tableRulesEasyChemistry } from "./table/TableRulesEasyChemistry";
import { TableRules } from "./table/TableRules";
import { tableRulesShort } from "./table/TableRulesShort";
import {
  categoryBlock,
  categoryBlockDLa,
  categoryProps,
  TCategories,
} from "./table/tableCategories";
import { findCategory } from "./table/findCategory";
import { ChemAgent } from "./core/ChemAgent";
import { XmlAttrs } from "./utils/xml/xmlTypes";
import { drawTag } from "./utils/xml/drawTag";
import { escapeXml } from "./utils/xml/escapeXml";
import { calcCharge } from "./inspectors/calcCharge";
import { roundMass } from "./math/massUtils";
import { makeFormulaSvgText } from "./browser/renderFormulaSvg";
import { WebFontCache } from "./drawSys/browser/WebFontCache";
import { ChemEquation } from "./equation/ChemEquation";
import { RulesBase } from "./textRules/RulesBase";
import { makeTextFormula } from "./inspectors/makeTextFormula";
import { dictTextRules } from "./textRules/dictTextRules";

export const ChemSys = Object.freeze({
  addDict(globalDict: Record<string, LocalDict>) {
    Lang.addDict(globalDict);
  },
  get ver(): number[] {
    return getVersion();
  },
  get verStr(): string {
    return getVersionStr();
  },
  compile(formula: string): ChemExpr {
    return compile(formula);
  },
  documentCompile(cfg: AutoCompileConfig = {}) {
    return documentCompile(cfg);
  },
  draw(
    owner: Element,
    exprOrCode: ChemExpr | ChemAgent | string,
    config?: AutoCompileConfig
  ): boolean {
    renderFormulaCfg(owner, exprOrCode, config ?? {});
    return true;
  },
  makeSVG(
    exprOrCode: ChemExpr | ChemAgent | string,
    fontPropsCache?: WebFontCache
  ): string {
    const expr =
      typeof exprOrCode === "string" ? compile(exprOrCode) : exprOrCode;
    return makeFormulaSvgText(expr, fontPropsCache);
  },
  /**
   *
   * @param objOrCode if string, then formula code, else ChemObj (usually ChemExpr)
   * @param rules by default = dictTextRules.text
   * @returns
   */
  makeTextFormula(objOrCode: ChemObj | string, rules?: RulesBase): string {
    const chemObj =
      typeof objOrCode === "string" ? compile(objOrCode) : objOrCode;
    return makeTextFormula(chemObj, rules);
  },
  dictTextRules,
  makeBruttoKey(src: ChemObj | string): string {
    return makeBruttoKey(src);
  },
  makeBrutto(src: ChemObj | string): ChemExpr {
    return compile(makeBruttoKey(src));
  },
  lang(key: string, params?: LangParams, langId?: string): string {
    return Lang.tr(key, params, langId);
  },
  get curLang(): string {
    return Lang.curLang;
  },
  set curLang(locale: string) {
    Lang.curLang = locale;
  },
  get navLang(): string | undefined {
    return Lang.navLang;
  },
  get Dict(): Record<string, LocalDict> {
    return Lang.dict;
  },
  isAbstract(chemObj: ChemObj): boolean {
    return isAbstract(chemObj);
  },
  calcMass(chemObj: ChemObj, applyAgentK?: boolean): number {
    return calcMass(chemObj, applyAgentK);
  },
  roundMass(mass: number): number {
    return roundMass(mass);
  },
  calcCharge(chemObj: ChemObj): number {
    return calcCharge(chemObj);
  },
  findElem(id: string): ChemAtom | undefined {
    return findElement(id);
  },
  drawTable(rules?: TableRules): string {
    return drawPeriodicTable(rules);
  },
  findCategory(table: TCategories, elemId: string, locale?: string) {
    return findCategory(table, elemId, locale);
  },
  TblRules: {
    Std: tableRulesStd,
    Wide: tableRulesWide,
    Short: tableRulesShort,
    EasyChemistry: tableRulesEasyChemistry,
  },
  TblCategory: {
    block: categoryBlock,
    blockDLa: categoryBlockDLa,
    props: categoryProps,
  },
  drawTag(tag: string, attrs: XmlAttrs, content?: string | number): string {
    return content === undefined
      ? drawTag(tag, attrs, true)
      : `${drawTag(tag, attrs)}${escapeXml(String(content))}</${tag}>`;
  },
  esc(content: string | number): string {
    return escapeXml(String(content));
  },

  /**
   * Solving a chemical equation
   * @param equation example: "H2 + O2 = H2O"
   * @returns Its recommended to use result.isOk() or getMessage() to check a result expression.
   *   You can use result.src and result.getAgents() to get results of equalize
   */
  equalize(equation: string): ChemExpr {
    const eq = new ChemEquation();
    eq.initBySrc(equation);
    eq.solve();
    if (!eq.isSolved()) {
      return ChemExpr.createWithError(eq.makeError(), equation);
    }
    return eq.getExpr()!;
  },
});
