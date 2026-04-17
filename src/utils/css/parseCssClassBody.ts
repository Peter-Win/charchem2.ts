import { XmlAttrs } from "../xml/xmlTypes";

export const parseCssClassBody = (body: string): XmlAttrs =>
  body
    .split(";")
    .map((s) => s.trim())
    .reduce((dict, item) => {
      const pos = item.indexOf(":");
      if (pos < 0) return dict;
      const name = item.slice(0, pos).trim();
      const value = item.slice(pos + 1).trim();
      return {
        ...dict,
        [name]: value,
      };
    }, {} as XmlAttrs);
