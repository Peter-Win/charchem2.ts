import { ChemAtom } from "../../core/ChemAtom";
import { ChemK } from "../../core/ChemK";
import { ifDef } from "../../utils/ifDef";

export type CCTFunc = {
  name: string;
  params?: string[];
};

/**
 * CharChem Text Node
 */
export type CCTNode = {
  colorType?: "item" | "atom";
  color?: string;
  content: string | CCTNode[];
  order?: number;
  funcs?: CCTFunc[];

  mass?: ChemK;
  atomNum?: ChemK;
  atom?: ChemAtom;
  atomColor?: string;
};

export const addFunc = (node: CCTNode, f: CCTFunc) => {
  // eslint-disable-next-line no-param-reassign
  node.funcs = node.funcs ?? [];
  node.funcs.push(f);
};

export const funcStr = (f?: CCTFunc): string => {
  if (!f) return "";
  return `$${f.name}(${ifDef(f.params, (it) => it.join(",")) ?? ""})`;
};
