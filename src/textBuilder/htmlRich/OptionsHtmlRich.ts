import { TextNode } from "../buildTextNodes";

export type IdGenerator = (node: TextNode | undefined) => string | undefined;

export type OptionsHtmlRich = {
  idGen?: IdGenerator;
  srcMap?: boolean;
  rootTag?: "span" | "div";
  rootClass?: string; // default = echem-formula
};
