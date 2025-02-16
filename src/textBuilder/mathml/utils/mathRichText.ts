import { TextNode } from "../../buildTextNodes/TextNode";
import { mathScripted } from "./mathScripted";
import { FnNodeToXml } from "../../xmlNode/FnNodeToXml";

export const mathRichText = (node: TextNode, create: FnNodeToXml) =>
  mathScripted(node.items ?? [], create);
