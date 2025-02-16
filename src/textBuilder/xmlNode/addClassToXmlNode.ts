import { XmlNode } from "./XmlNode";

/* eslint no-param-reassign: "off" */

export const addClassToXmlNode = (
  node: XmlNode,
  className: string | string[]
) => {
  const newList = (
    typeof className === "string" ? className : className.join(" ")
  )
    .split(" ")
    .filter((s) => s);
  const oldList = new Set<string>(node.attrs?.class?.split(" ") ?? []);
  newList.forEach((name) => oldList.add(name));
  node.attrs = node.attrs || {};
  node.attrs!.class = Array.from(oldList).join(" ");
};
