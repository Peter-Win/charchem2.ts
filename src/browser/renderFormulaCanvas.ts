import { createChemImgProps } from "../drawSys/browser/createChemImgProps";
import { renderTopFrame } from "../drawSys/figures/renderTopFrame";
import { buildExpression } from "../structBuilder/buildExpression";
import { HtmlCanvasSurface } from "../drawSys/browser/HtmlCanvasSurface";
import { WebFontCache } from "../drawSys/browser/WebFontCache";
import { ChemExpr } from "../core/ChemExpr";

export const renderFormulaCanvas = (
  owner: Element,
  expr: ChemExpr,
  fontPropsCache?: WebFontCache
): void => {
  if (!document) return;
  // eslint-disable-next-line no-param-reassign
  owner.innerHTML = ""; // clear owner's content
  const canvas = document.createElement("canvas");
  owner.append(canvas);
  const surface = new HtmlCanvasSurface(canvas, fontPropsCache);
  const props = createChemImgProps(owner, surface);
  const { frame } = buildExpression(expr, props);
  renderTopFrame(frame, surface);
};
