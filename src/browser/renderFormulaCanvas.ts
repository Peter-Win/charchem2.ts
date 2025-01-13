import { createBrowserChemImgProps } from "../drawSys/browser/createBrowserChemImgProps";
import { renderTopFrame } from "../drawSys/figures/renderTopFrame";
import { HtmlCanvasSurface } from "../drawSys/browser/HtmlCanvasSurface";
import { WebFontCache } from "../drawSys/browser/WebFontCache";
import { ChemExpr } from "../core/ChemExpr";
import { ChemAgent } from "../core/ChemAgent";
import { buildFrame } from "../structBuilder/buildFrame";
import { addClass } from "./addClass";

export const renderFormulaCanvas = (
  owner: Element,
  expr: ChemExpr | ChemAgent,
  fontPropsCache?: WebFontCache
): void => {
  if (!document) return;
  // eslint-disable-next-line no-param-reassign
  owner.innerHTML = ""; // clear owner's content
  const canvas = document.createElement("canvas");
  owner.append(canvas);
  const surface = new HtmlCanvasSurface(canvas, fontPropsCache);
  const props = createBrowserChemImgProps(owner, surface);
  renderTopFrame(buildFrame(expr, props), surface);
  addClass(owner, "echem-is-canvas");
};
