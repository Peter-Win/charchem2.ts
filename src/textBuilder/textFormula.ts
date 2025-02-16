import { ChemExpr } from "../core/ChemExpr";
import { compile } from "../compiler/compile";
import { ChemObj } from "../core/ChemObj";
import { OptionsHtmlRich } from "./htmlRich/OptionsHtmlRich";
import { buildTextNodes } from "./buildTextNodes";
import { buildHtmlRich } from "./htmlRich/buildHtmlRich";
import { buildTextFormat, OptionsTextFormat } from "./text/buildTextFormat";
import { buildTeX, TeXOptions } from "./tex/buildTeX";
import { MathMLOptions } from "./mathml/MathMLOptions";
import { buildMathML } from "./mathml/buildMathML";
import { renderXmlNode, renderXmlNodes } from "./xmlNode/renderXmlNode";

type OptionsXmlRender = {
  indent?: string;
};

type FmtHtmlRich = {
  type: "html";
  options?: OptionsHtmlRich & OptionsXmlRender;
};
type FmtText = {
  type: "text";
  options?: OptionsTextFormat;
};
type FmtTeX = {
  type: "TeX";
  options?: TeXOptions;
};
type FmtMathML = {
  type: "MathML";
  options?: MathMLOptions & OptionsXmlRender;
};

export type FmtDef = FmtHtmlRich | FmtText | FmtTeX | FmtMathML;
export type FmtType = FmtDef["type"];

export const textTypes: readonly FmtType[] = ["html", "text", "MathML", "TeX"];

export const textFormula = (
  objOrCode: ChemObj | string,
  fmtOrType: FmtDef | FmtType
): string => {
  const chemObj =
    typeof objOrCode === "string" ? compile(objOrCode) : objOrCode;
  if (chemObj instanceof ChemExpr && !chemObj.isOk()) {
    return chemObj.getMessage();
  }
  const fmt: FmtDef =
    typeof fmtOrType === "string" ? { type: fmtOrType } : fmtOrType;
  const textNode = buildTextNodes(chemObj);
  switch (fmt.type) {
    case "html": {
      const { indent, ...htmlOptions } = fmt.options ?? {};
      return renderXmlNodes(buildHtmlRich(textNode, htmlOptions).nodes, {
        indent,
        noSelfClosed: true,
      });
    }
    case "text":
      return buildTextFormat(textNode, fmt.options);
    case "TeX":
      return buildTeX(textNode, fmt.options);
    case "MathML": {
      const { indent, ...mmlOptions } = fmt.options ?? {};
      return renderXmlNode(buildMathML(textNode, mmlOptions), { indent });
    }
    default:
      break;
  }
  return "";
};
