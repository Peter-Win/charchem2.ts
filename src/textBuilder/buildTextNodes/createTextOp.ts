import { ChemOp } from "../../core/ChemOp";
import { TextNode } from "./TextNode";
import { splitRichText } from "./splitRichText";

export const createTextOp = (op: ChemOp): TextNode => {
  const opItem: TextNode = {
    type: "op",
    op,
    color: op.color,
  };
  const { commentPre, commentPost } = op;
  if (!commentPre && !commentPost) {
    return opItem;
  }
  const items: TextNode[] = [opItem];
  const colItem: TextNode = {
    type: "column",
    columnType: "op",
    color: op.color,
    items,
  };
  if (commentPre)
    items.push({
      ...splitRichText(commentPre.text, op.color),
      pos: "T",
    });
  if (commentPost)
    items.push({
      ...splitRichText(commentPost.text, op.color),
      pos: "B",
    });
  return colItem;
};
