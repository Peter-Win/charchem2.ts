import { ChemAgent } from "../core/ChemAgent";
import { compile } from "../compiler/compile";
import { ChemExpr } from "../core/ChemExpr";
import { isTextFormula } from "../inspectors/isTextFormula";
import { makeTextFormula } from "../inspectors/makeTextFormula";
import { rulesHtml } from "../textRules/rulesHtml";
import { AutoCompileConfig } from "./AutoCompileConfig";
import { renderFormulaCanvas } from "./renderFormulaCanvas";
import { renderFormulaSvg } from "./renderFormulaSvg";
import { addClass } from "./addClass";

export const renderFormulaCfg = (
  owner: Element,
  exprOrCode: ChemExpr | ChemAgent | string,
  config: AutoCompileConfig
): void => {
  const expr =
    typeof exprOrCode === "string" ? compile(exprOrCode) : exprOrCode;
  if (expr instanceof ChemExpr && !expr.isOk()) {
    owner.classList?.add("echem-error");
    owner.setAttribute("title", expr.getMessage());
  } else {
    const canText = !config.nonText && isTextFormula(expr);
    if (canText) {
      // eslint-disable-next-line no-param-reassign
      owner.innerHTML = makeTextFormula(expr, rulesHtml);
      addClass(owner, "echem-is-text");
    } else if (config.drawSysId === "canvas") {
      renderFormulaCanvas(owner, expr, config.fontPropsCache);
    } else {
      renderFormulaSvg(owner, expr, config.fontPropsCache);
    }
    if (expr instanceof ChemExpr) {
      owner.setAttribute("data-src", expr.src0.trim());
    }
  }
};
