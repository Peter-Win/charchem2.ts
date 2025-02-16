import { XmlNode } from "../../xmlNode/XmlNode";
import { CtxCreateMathMLNode } from "../CtxCreateMathMLNode";
import { mathItem } from "./mathItem";

export const mathText = (
  ctx: CtxCreateMathMLNode,
  text: string,
  color: string | undefined
): XmlNode => {
  if (/^\d+$/.test(text))
    return {
      tag: "mn",
      content: text,
      color,
    };
  if (ctx.textMode === "custom") return mathItem(text, color);
  return {
    tag: "mtext",
    content: text,
    color,
  };
};
