import { XmlAttrs } from "../../utils/xml/xmlTypes";
import { TextNode } from "../buildTextNodes";
import { XmlNode } from "../xmlNode/XmlNode";
import { CtxHtmlRich } from "./createHtmlRichNodes";
import { HtmlRichClass, htmlRichCls } from "./HtmlRichClasses";

export const makeCchTag = (p: {
  ctx: CtxHtmlRich;
  srcNode: TextNode | undefined;
  cls?: HtmlRichClass | HtmlRichClass[];
  attrs?: XmlAttrs;
  content?: XmlNode["content"] | (() => XmlNode["content"]);
}): XmlNode => {
  const { content, ctx, srcNode, cls } = p;
  const node: XmlNode = {
    tag: "span",
  };
  if (p.attrs) node.attrs = p.attrs;
  if (srcNode?.color) {
    node.color = srcNode.color;
  }
  const setAttr = (name: string, value: string) => {
    let { attrs } = node;
    if (!attrs) {
      attrs = {};
      node.attrs = attrs;
    }
    attrs[name] = value;
  };
  if (ctx.options?.idGen) {
    const id = ctx.options.idGen(srcNode);
    if (id) {
      setAttr("id", id);
      if (ctx.srcMap && srcNode) {
        ctx.srcMap[id] = { txtNode: srcNode };
      }
    }
  }
  if (cls) {
    setAttr("class", htmlRichCls(cls));
  }
  if (content) {
    node.content = typeof content === "function" ? content() : content;
  }
  return node;
};
