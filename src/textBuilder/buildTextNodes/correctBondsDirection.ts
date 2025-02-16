import { TextNode } from "./TextNode";

export const correctBondsDirection = (
  groupNode: TextNode | undefined
): void => {
  if (groupNode?.type !== "group") return;
  const { items } = groupNode;
  if (!items?.some((node) => node.type === "bond" && node.bond.isNeg)) {
    return;
  }
  items.reverse();
  const n = items.length - 1;
  if (n > 0 && items[0]?.type === "bracket" && items[n]?.type === "bracket") {
    const tmp = items[0]!;
    items[0] = items[n]!;
    items[n] = tmp;
  }
};
