import { drawTag } from "../../utils/xml/drawTag";
import { escapeXml } from "../../utils/xml/escapeXml";
import { XmlNode } from "./XmlNode";

export type OptionsRenderXmlNode = {
  indent?: string;
  noSelfClosed?: boolean;
};

export const renderXmlNode = (
  { tag, attrs, color, content }: XmlNode,
  options?: OptionsRenderXmlNode,
  level: number = 0
): string => {
  if (!tag) {
    if (typeof content === "string") {
      return escapeXml(content);
    }
    if (Array.isArray(content)) {
      return renderXmlNodes(content, options, level);
    }
  }

  const indent = options?.indent ?? "";
  const canSelfClosed = !options?.noSelfClosed;
  const attrsExt = color
    ? {
        ...attrs,
        style: `color: ${color}`, // Предполагается, что такого атрибута нет в attrs
      }
    : attrs;
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
        res += renderXmlNode(subNode, options, level + 1);
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
  level: number = 0
): string =>
  (nodes ?? []).map((node) => renderXmlNode(node, options, level)).join("");
