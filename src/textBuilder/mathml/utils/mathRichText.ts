import { RichTextProps, TextNode } from "../../buildTextNodes/TextNode";
import { mathScripted } from "./mathScripted";
import { FnNodeToXml } from "../../xmlNode/FnNodeToXml";
import { XmlNode } from "../../xmlNode/XmlNode";
import { createMathMLNode } from "../createMathMLNode";
import { CtxCreateMathMLNode } from "../CtxCreateMathMLNode";

export const mathRichText = (
  node: TextNode,
  ctx: CtxCreateMathMLNode,
  props: RichTextProps | undefined,
  color: string | undefined,
): XmlNode => {
  const newCtx = {
    ...ctx,
    rtProps: { ...ctx.rtProps },
  };
  if (props?.bold) {
    newCtx.rtProps.bold = true;
  }
  if (props?.italic) {
    newCtx.rtProps.italic = true;
  }
  const fontsize = props?.fontSizePt ? `${props.fontSizePt * 10}%` : undefined;
  const create: FnNodeToXml = (src) => createMathMLNode(src, newCtx);
  const content = mathScripted(node.items ?? [], create);
  if (fontsize) {
    return {
      tag: "mstyle",
      attrs: {
        // TODO: К сожалению, эксперименты с размером шрифта оказались неудачными. Пока это нигде не работает.
        // style: `font-size: ${fontsize}`,
        fontsize,
        displaystyle: "false",
      },
      content: [content],
      color,
    };
  }
  return content;
};
