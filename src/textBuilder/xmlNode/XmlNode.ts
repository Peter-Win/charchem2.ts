import { XmlAttrs } from "../../utils/xml/xmlTypes";

export type XmlNode = {
  tag: string;
  attrs?: XmlAttrs;
  color?: string;
  content?: string | XmlNode[];
  noIndent?: boolean; // При формировании RichText из разных тегов "красивый" код с отступами приводит к появлению ненужных пробелов.
};
