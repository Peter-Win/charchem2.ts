import { ChemExpr } from "../core/ChemExpr";
import { SvgWebSurface } from "../drawSys/browser/SvgWebSurface";
import { createChemImgProps } from "../drawSys/browser/createChemImgProps";
import { renderTopFrame } from "../drawSys/figures/renderTopFrame";
import { buildExpression } from "../structBuilder/buildExpression";

/**
 * Make a local SVG image for the specified expression on the given HTML element.
 * @param owner HTML element. The content will be completely replaced by the SVG image.
 * @param expr
 */
export const renderFormulaSvg = (owner: HTMLElement, expr: ChemExpr) => {
  if (!document) return;
  const surface = new SvgWebSurface();
  const props = createChemImgProps(owner, surface);
  const { frame } = buildExpression(expr, props);
  renderTopFrame(frame, surface);
  const { bounds } = frame;
  // eslint-disable-next-line no-param-reassign
  owner.innerHTML = surface.exportText({
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
  });
};
