import { renderFormulaSvg } from "./browser/renderFormulaSvg";
import { compile } from "./compiler/compile";
import { ChemExpr } from "./core/ChemExpr";
import { getVersion, getVersionStr } from "./getVersion";

export const ChemSys = Object.freeze({
  get ver(): number[] {
    return getVersion();
  },
  get verStr(): string {
    return getVersionStr();
  },
  compile(formula: string): ChemExpr {
    return compile(formula);
  },
  drawSvg(owner: HTMLElement, expr: ChemExpr) {
    renderFormulaSvg(owner, expr);
  },
});

// @ts-ignore
if (window) window.ChemSys = ChemSys;
