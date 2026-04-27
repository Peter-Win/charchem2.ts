import { XmlNode } from "../../xmlNode/XmlNode";
import { CtxCreateMathMLNode } from "../CtxCreateMathMLNode";
import { mathItem } from "./mathItem";

export const mathText = (
  { textMode, rtProps }: CtxCreateMathMLNode,
  text: string,
  color: string | undefined,
): XmlNode => {
  if (textMode === "custom" && rtProps) {
    const res = {
      tag: "mi",
      attrs: { mathvariant: "normal" },
      content: text,
      color,
    } satisfies XmlNode;
    if (rtProps.bold && rtProps.italic) {
      res.attrs.mathvariant = "bold-italic";
    } else if (rtProps.bold) {
      res.attrs.mathvariant = "bold";
    } else if (rtProps.italic) {
      res.attrs.mathvariant = "italic";
    }
    return res;
  }
  if (/^\d+$/.test(text))
    return {
      tag: "mn",
      content: text,
      color,
    };
  if (textMode === "custom") return mathItem(text, color);
  return {
    tag: "mtext",
    content: text,
    color,
  };
};
