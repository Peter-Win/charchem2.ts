import { parseCssClassBody } from "../../utils/css/parseCssClassBody";
import { drawTag } from "../../utils/xml/drawTag";
import { escapeXml } from "../../utils/xml/escapeXml";
import { XmlNode } from "./XmlNode";
import { makeCssClassBody } from "../../utils/css/makeCssClassBody";
import { XmlAttrs } from "../../utils/xml/xmlTypes";

export type OptionsRenderXmlNode = {
  indent?: string;
  noSelfClosed?: boolean;
};

export const renderXmlNode = (
  { tag, attrs, color, content, noIndent }: XmlNode,
  options?: OptionsRenderXmlNode,
  level: number = 0,
): string => {
  if (!tag) {
    if (typeof content === "string") {
      return escapeXml(content);
    }
    if (Array.isArray(content)) {
      return renderXmlNodes(content, options, level);
    }
  }

  let indent = options?.indent ?? "";
  const subOptions = options;
  if (noIndent) {
    // такой фокус потребовался, чтобы избежать нежелательных пробелов
    indent = "";
    if (subOptions) subOptions.indent = undefined;
  }
  const canSelfClosed = !options?.noSelfClosed;
  const { style = "", ...otherAttrs } = attrs ?? {};
  const css = parseCssClassBody(style);
  if (color) css.color = color;
  const styleExt = makeCssClassBody(css);
  const attrsExt: XmlAttrs = { ...otherAttrs };
  if (styleExt) attrsExt.style = styleExt;
  let res = "";
  const addStr = (str: string, strLevel: number) => {
    if (indent) res += indent.repeat(strLevel);
    res += str;
    if (indent) res += "\n";
  };

  if (!content || (Array.isArray(content) && content.length === 0)) {
    if (canSelfClosed) {
      addStr(drawTag(tag, attrsExt, true), level);
    } else {
      addStr(`${drawTag(tag, attrsExt)}</${tag}>`, level);
    }
  } else {
    addStr(drawTag(tag, attrsExt, !content), level);
    if (typeof content === "string" && content.trim()) {
      const xc = escapeXml(content);
      if (xc.length > 40) {
        addStr(xc, level + 1);
      } else {
        if (indent) res = res.slice(0, -1);
        res += xc;
        addStr(`</${tag}>`, 0);
        return res;
      }
    } else if (Array.isArray(content)) {
      content.forEach((subNode) => {
        res += renderXmlNode(subNode, subOptions, level + 1);
      });
    }
    if (content) {
      addStr(`</${tag}>`, level);
    }
  }
  return res;
};

export const renderXmlNodes = (
  nodes: XmlNode[] | undefined,
  options?: OptionsRenderXmlNode,
  level: number = 0,
): string =>
  (nodes ?? []).map((node) => renderXmlNode(node, options, level)).join("");
