import { XmlAttrs } from "../../utils/xml/xmlTypes";

export type XmlNode = {
  tag: string;
  attrs?: XmlAttrs;
  color?: string;
  content?: string | XmlNode[];
};
