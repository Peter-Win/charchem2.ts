import { WebFontCache } from "../drawSys/browser/WebFontCache";
import { ChemExpr } from "../core/ChemExpr";
import { SvgWebSurface } from "../drawSys/browser/SvgWebSurface";
import { createChemImgProps } from "../drawSys/browser/createChemImgProps";
import { renderTopFrame } from "../drawSys/figures/renderTopFrame";
import { ChemAgent } from "../core/ChemAgent";
import { buildFrame } from "../structBuilder/buildFrame";
import { standaloneExportOptions } from "../drawSys/svg/standaloneExportOptions";

/**
 * Make a local SVG image for the specified expression on the given HTML element.
 * @param owner HTML element. The content will be completely replaced by the SVG image.
 * @param expr
 */
export const renderFormulaSvg = (
  owner: Element,
  expr: ChemExpr | ChemAgent,
  fontPropsCache?: WebFontCache
) => {
  if (typeof document === "undefined") return;
  const surface = new SvgWebSurface(fontPropsCache);
  const props = createChemImgProps(owner, surface);
  const frame = buildFrame(expr, props);
  renderTopFrame(frame, surface);
  const { bounds } = frame;
  // eslint-disable-next-line no-param-reassign
  owner.innerHTML = surface.exportText({
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
  });
};

export const makeFormulaSvgText = (
  expr: ChemExpr | ChemAgent,
  fontPropsCache?: WebFontCache
) => {
  if (typeof document === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.setAttribute("class", "echem-formula");
  try {
    document.body.append(tmp);
    const surface = new SvgWebSurface(fontPropsCache);
    const props = createChemImgProps(tmp, surface);
    const frame = buildFrame(expr, props);
    renderTopFrame(frame, surface);
    const { bounds } = frame;
    return surface.exportText({
      ...standaloneExportOptions,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
    });
  } finally {
    tmp.remove();
  }
};
