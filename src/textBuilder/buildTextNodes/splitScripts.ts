import { ifDef } from "../../utils/ifDef";
import { TextNode, TextPosition } from "./TextNode";

export type ScriptKey = "C" | "RT" | "RB" | "LT" | "LB";
const scriptKeys: Readonly<Record<TextPosition, ScriptKey>> = {
  C: "C",
  T: "C",
  B: "C",
  LT: "LT",
  RT: "RT",
  LB: "LB",
  RB: "RB",
};

export const splitScripts = (nodes: TextNode[] = []) => {
  const dict: Partial<Record<ScriptKey, TextNode[]>> = {};
  nodes.forEach((it) => {
    const { pos } = it;
    const key: ScriptKey = ifDef(pos, (p) => scriptKeys[p]) ?? "C";
    dict[key] = [...(dict[key] ?? []), it];
  });
  return dict;
};
