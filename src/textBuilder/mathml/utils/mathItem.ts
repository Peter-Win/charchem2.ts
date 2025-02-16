import { XmlNode } from "../../xmlNode/XmlNode";

export const mathItem = (text: string, color: string | undefined): XmlNode => {
  const res: XmlNode = {
    tag: "mi",
    color,
    content: text,
  };
  if (text.length === 1) res.attrs = { mathvariant: "normal" };
  return res;
};
