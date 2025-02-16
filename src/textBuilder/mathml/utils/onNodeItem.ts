import { splitColumn } from "../../buildTextNodes/splitColumn";
import { TextNode } from "../../buildTextNodes/TextNode";
import { FnNodeToXml } from "../../xmlNode/FnNodeToXml";
import { XmlNode } from "../../xmlNode/XmlNode";
import { mathColumn } from "./mathColumn";
import { mathScripted } from "./mathScripted";

export const onNodeItem = (
  itemNode: TextNode,
  create: FnNodeToXml
): XmlNode | undefined => {
  const { items } = itemNode;
  if (!items) return undefined;
  const colDict = splitColumn(items);
  const { C, B, T } = colDict;
  if (!C) return undefined;
  const scripted = mathScripted(C, create);
  return mathColumn({ C: scripted, B, T }, create);
};
