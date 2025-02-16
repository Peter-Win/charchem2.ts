import { optimizeColors } from "../buildTextNodes/optimizeColors";
import { XmlNode } from "./XmlNode";

export const optimizeXmlColors = (node: XmlNode) =>
  optimizeColors(node, ({ content }) =>
    Array.isArray(content) ? content : undefined
  );
