import { TextNode } from "../buildTextNodes";

export type HtmlRichMapItem = {
  txtNode: TextNode;
};
export type HtmlRichMap = Record<string, HtmlRichMapItem>;
