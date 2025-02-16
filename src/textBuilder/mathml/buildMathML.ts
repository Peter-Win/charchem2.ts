import { ifDef } from "../../utils/ifDef";
import { TextNode } from "../buildTextNodes/TextNode";
import { optimizeXmlColors } from "../xmlNode/optimizeXmlColors";
import { XmlNode } from "../xmlNode/XmlNode";
import { createMathMLNode } from "./createMathMLNode";
import { CtxCreateMathMLNode } from "./CtxCreateMathMLNode";
import { MathMLOptions, mathMLRootAttrs } from "./MathMLOptions";

export const buildMathML = (
  rootNode: TextNode,
  options?: MathMLOptions
): XmlNode => {
  const ctx: CtxCreateMathMLNode = {};
  const dstNode: XmlNode = {
    tag: "math",
    attrs: mathMLRootAttrs(options),
    content: ifDef(createMathMLNode(rootNode, ctx), (it) => [it]),
  };
  optimizeXmlColors(dstNode);
  return dstNode;
};
