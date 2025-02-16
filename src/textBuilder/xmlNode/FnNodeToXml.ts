import { TextNode } from "../buildTextNodes/TextNode";
import { XmlNode } from "./XmlNode";

export type FnNodeToXml = (src: TextNode) => XmlNode | undefined;
