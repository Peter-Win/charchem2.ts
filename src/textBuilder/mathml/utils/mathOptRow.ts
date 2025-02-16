import { XmlNode } from "../../xmlNode/XmlNode";
import { TextNode } from "../../buildTextNodes/TextNode";
import { FnNodeToXml } from "../../xmlNode/FnNodeToXml";

export const mathOptRow = (nodes: TextNode[], create: FnNodeToXml): XmlNode => {
  // TODO: так как используется немного устаревшая версия TypeScript, то он не умеет правильно определять тип после filter
  const content: XmlNode[] = nodes
    .map(create)
    .filter((it) => !!it) as XmlNode[];
  if (content.length === 0) return { tag: "mrow" };
  if (content.length === 1) return content[0]!;
  return {
    tag: "mrow",
    content,
  };
};
