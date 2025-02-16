import { splitScripts } from "../../buildTextNodes/splitScripts";
import { TextNode } from "../../buildTextNodes/TextNode";
import { FnNodeToXml } from "../../xmlNode/FnNodeToXml";
import { XmlNode } from "../../xmlNode/XmlNode";
import { dictKeys } from "../../buildTextNodes/dictKeys";
import { mathOptRow } from "./mathOptRow";

export const mathScripted = (
  nodes: TextNode[],
  create: FnNodeToXml,
  createCenter?: FnNodeToXml
): XmlNode => {
  const dict = splitScripts(nodes);
  const { C = [], RT, RB, LT, LB } = dict;
  const key = dictKeys(dict);
  if (key === "C") {
    return mathOptRow(C, create);
  }
  let tag = "";
  let groups: (TextNode[] | string | undefined)[] = [];
  if (RB && key === "C,RB") {
    tag = "msub";
    groups = [C, RB];
  } else if (RT && key === "C,RT") {
    tag = "msup";
    groups = [C, RT];
  } else if (RB && RT && key === "C,RB,RT") {
    tag = "msubsup";
    groups = [C, RB, RT];
  } else {
    tag = "mmultiscripts";
    groups = [C, RB, RT, "mprescripts", LB, LT];
  }
  const content: XmlNode[] = groups.map((it, i): XmlNode => {
    if (!it) return { tag: "mrow" };
    if (typeof it === "string") return { tag: it };
    const fn = i ? create : createCenter ?? create;
    return mathOptRow(it, fn) ?? { tag: "mrow" };
  });
  return { tag, content };
};
