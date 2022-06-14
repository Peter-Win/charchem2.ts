import { XmlAttrs } from "./xmlTypes";
import { escapeXml } from "./escapeXml";

export const drawTag = (
  tagName: string,
  attrs?: XmlAttrs,
  closed?: boolean,
  escape?: (value: string) => string
) => {
  let result = `<${tagName}`;
  if (attrs) {
    const cvt = escape ?? escapeXml;
    Object.keys(attrs).forEach((attrName) => {
      result += ` ${attrName}="${cvt(attrs[attrName]!)}"`;
    });
  }
  if (closed) result += " /";
  return `${result}>`;
};
