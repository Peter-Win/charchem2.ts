import { TextNode } from "../buildTextNodes";
import { optimizeColors } from "../buildTextNodes/optimizeColors";
import { renderXmlNodes } from "../xmlNode/renderXmlNode";
import { XmlNode } from "../xmlNode/XmlNode";
import { htmlPoorNodes } from "./htmlPoorNodes";
import { OptionsHtmlPoor } from "./OptionsHtmlPoor";

/* eslint no-param-reassign: "off" */

export const htmlPoor = (
  srcNode: TextNode,
  options?: OptionsHtmlPoor
): string => {
  const dstNodes = htmlPoorNodes(srcNode, options);
  dstNodes?.forEach((n) =>
    optimizeColors(n, (owner) =>
      Array.isArray(owner.content) ? owner.content : undefined
    )
  );
  hideSpanNodes(dstNodes);
  return renderXmlNodes(dstNodes, { noSelfClosed: true });
};

const hideSpanNodes = (nodes: XmlNode[] | undefined) =>
  nodes?.forEach(hideSpans);

const hideSpans = (node: XmlNode) => {
  if (node.tag === "span" && !node.attrs && !node.color) {
    node.tag = "";
  }
  if (Array.isArray(node.content)) {
    hideSpanNodes(node.content);
  }
};
