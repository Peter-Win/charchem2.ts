import { addAutoCompileEvent } from "./browser/autoCompile";
import { AutoCompileConfig } from "./browser/AutoCompileConfig";
import { renderFormulaCfg } from "./browser/renderFormulaCfg";
import { compile } from "./compiler/compile";
import { ChemExpr } from "./core/ChemExpr";
import { ChemObj } from "./core/ChemObj";
import { getVersion, getVersionStr } from "./getVersion";
import { makeBruttoKey } from "./inspectors/makeBruttoKey";
import { isAbstract } from "./inspectors/isAbstract";
import { Lang, LangParams, LocalDict } from "./lang/Lang";
import { calcMass } from "./inspectors/calcMass";
import { ChemAtom } from "./core/ChemAtom";
import { findElement, PeriodicTable } from "./core/PeriodicTable";
import { drawPeriodicTable } from "./table/drawPeriodicTable";
import { documentCompile } from "./browser/documentCompile";
import { tableRulesStd } from "./table/TableRulesStd";
import { tableRulesWide } from "./table/TableRulesWide";
import { TableRules } from "./table/TableRules";
import { tableRulesShort } from "./table/TableRulesShort";
import {
  categoryBlock,
  categoryProps,
  TCategories,
} from "./table/tableCategories";
import { findCategory } from "./table/findCategory";
import { ChemAgent } from "./core/ChemAgent";
import { XmlAttrs } from "./utils/xml/xmlTypes";
import { drawTag } from "./utils/xml/drawTag";
import { escapeXml } from "./utils/xml/escapeXml";

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
  },
  TblCategory: {
    block: categoryBlock,
    props: categoryProps,
  },
  drawTag(tag: string, attrs: XmlAttrs, content?: string | number): string {
    return content === undefined
      ? drawTag(tag, attrs, true)
      : `${drawTag(tag, attrs)}${escapeXml(String(content))}</${tag}>`;
  },
});

if (window) {
  // @ts-ignore
  window.ChemSys = ChemSys;
  // deprecated. Used for compatibility with previous versions.
  // @ts-ignore
  window.MenTblArray = PeriodicTable.elements;
  // @ts-ignore
  window.MenTbl = PeriodicTable.dict;
  addAutoCompileEvent();
}
