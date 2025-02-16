import { TextNode } from "./TextNode";

type ColKey = "C" | "T" | "B";

export const splitColumn = (nodes: TextNode[] = []) => {
  const dict: Partial<Record<ColKey, TextNode[]>> = {};
  nodes.forEach((it) => {
    const { pos } = it;
    const key: ColKey = pos === "T" || pos === "B" ? pos : "C";
    dict[key] = [...(dict[key] ?? []), it];
  });
  return dict;
};
