import { TextNode } from "../buildTextNodes";
import { cloneTextNode } from "../buildTextNodes/cloneTextNode";
import { XmlNode } from "../xmlNode/XmlNode";
import { createHtmlRichNodes, CtxHtmlRich } from "./createHtmlRichNodes";
import { HtmlRichMap } from "./HtmlRichMap";
import { OptionsHtmlRich } from "./OptionsHtmlRich";

export type ResultHtmlRich = {
  nodes: XmlNode[] | undefined;
  srcMap?: HtmlRichMap;
};

export const buildHtmlRich = (
  srcNode: TextNode,
  options?: OptionsHtmlRich
): ResultHtmlRich => {
  const rootNode = cloneTextNode(srcNode);
  // optimizeColors(rootNode, (n) => Array.isArray(n.items) ? n.items : undefined);

  const ctx: CtxHtmlRich = { options };
  if (options?.srcMap) {
    ctx.srcMap = {};
  }
  const nodes = createHtmlRichNodes(rootNode, ctx);
  // v-- stack overflow
  // nodes.forEach(it => optimizeColors(it, n => Array.isArray(it.content) ? it.content : undefined));
  const res: ResultHtmlRich = { nodes };
  if (ctx.srcMap) res.srcMap = ctx.srcMap;
  return res;
};
