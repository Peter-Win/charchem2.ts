import { XmlNode } from "../../xmlNode/XmlNode";
import { dictKeys } from "../../buildTextNodes/dictKeys";
import { TextNode } from "../../buildTextNodes/TextNode";
import { FnNodeToXml } from "../../xmlNode/FnNodeToXml";
import { mathOptRow } from "./mathOptRow";
import { ifDef } from "../../../utils/ifDef";

type ColDict = {
  C?: TextNode[] | XmlNode;
  B?: TextNode[];
  T?: TextNode[];
};

export const mathColumn = (
  dict: ColDict,
  create: FnNodeToXml
): XmlNode | undefined => {
  const keys = dictKeys(dict);
  const { C = [], T, B } = dict;
  const xC = "tag" in C ? C : mathOptRow(C, create);
  if (keys === "C" || keys === "") {
    return xC;
  }
  let tag = "";
  const xB = ifDef(B, (it) => mathOptRow(it, create));
  const xT = ifDef(T, (it) => mathOptRow(it, create));
  let content: XmlNode[] = [];
  if (xB && xT) {
    tag = "munderover";
    content = [xC, xB, xT];
  } else if (xB) {
    tag = "munder";
    content = [xC, xB];
  } else if (xT) {
    tag = "mover";
    content = [xC, xT];
  }
  if (!tag) return undefined;
  return { tag, content };
};
