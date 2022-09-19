import { addAutoCompileEvent } from "./browser/autoCompile";
import { AutoCompileConfig } from "./browser/AutoCompileConfig";
import { renderFormulaCfg } from "./browser/renderFormulaCfg";
import { compile } from "./compiler/compile";
import { ChemExpr } from "./core/ChemExpr";
import { getVersion, getVersionStr } from "./getVersion";
import { Lang, LocalDict } from "./lang/Lang";

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
  ) {
    renderFormulaCfg(owner, exprOrCode, config ?? {});
  },
});

if (window) {
  // @ts-ignore
  window.ChemSys = ChemSys;
  addAutoCompileEvent();
}
