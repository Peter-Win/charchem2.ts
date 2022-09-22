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
  draw(
    owner: Element,
    exprOrCode: ChemExpr | string,
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
  isAbstract(chemObj: ChemObj): boolean {
    return isAbstract(chemObj);
  },
  calcMass(chemObj: ChemObj, applyAgentK?: boolean): number {
    return calcMass(chemObj, applyAgentK);
  },
  findElem(id: string): ChemAtom | undefined {
    return findElement(id);
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
