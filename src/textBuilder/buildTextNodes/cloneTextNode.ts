import { TextNode } from "./TextNode";

export const cloneTextNode = (node: TextNode): TextNode => ({
  ...node,
  items: node.items?.map(cloneTextNode),
});
