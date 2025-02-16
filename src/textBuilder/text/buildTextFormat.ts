/**
 * ASCII is used predominantly.
 * But the result is still in UNICODE.
 * Because comments and abstract elements can contain an extended set of characters.
 */

import { TextNode } from "../buildTextNodes";
import { cloneTextNode } from "../buildTextNodes/cloneTextNode";
import { optimizeColors } from "../buildTextNodes/optimizeColors";
import { splitColumn } from "../buildTextNodes/splitColumn";
import { ScriptKey, splitScripts } from "../buildTextNodes/splitScripts";

type OxidationPos =
  | "*RT"
  | "RT*"
  | "*RB"
  | "RB*"
  | "*LB"
  | "LB*"
  | "*LT"
  | "LT*";
type FnOxidation = (center: string, oxst: string) => string;
type FnScript = (text: string, left?: boolean) => string;
type FnOpComment = (text: string, where: "above" | "below") => string;

export type OptionsTextFormat = {
  // default values are first
  operations?: "ascii" | "dstText";
  opComments?: "text" | "ignore" | "quoted" | FnOpComment;
  sup?: "withHat" | "text" | FnScript;
  sub?: "text" | "withUnderscore" | FnScript;
  oxidationState?: "ignore" | "sup" | OxidationPos | FnOxidation;
  mul?: string; // *
  scriptDivider?: string; // ""
};

export const buildTextFormat = (
  srcNode: TextNode,
  options?: OptionsTextFormat
): string => {
  const dstNode = cloneTextNode(srcNode);
  optimizeColors(dstNode, ({ items }) => items);
  return strNode(dstNode, options);
};

const strNode = (srcNode: TextNode, options?: OptionsTextFormat): string => {
  switch (srcNode.type) {
    case "atom":
      return srcNode.atom.id;
    case "bond":
      return srcNode.bond.tx;
    case "bracket":
      return srcNode.text;
    case "brackets":
      return strScripted(splitScripts(srcNode.items), undefined, options);
    case "charge":
      return srcNode.charge.text;
    case "column":
      return strExtOp(srcNode, options);
    case "comma":
      return ",";
    case "comment":
    case "custom":
    case "group":
      return strItems(srcNode.items, options);
    case "item":
      return strNodeItem(srcNode, options);
    case "k":
      return srcNode.k.toString();
    case "mul":
      return options?.mul ?? "*";
    case "op":
      return strOp(srcNode.op.dstText, options);
    case "radical":
      return srcNode.radical.label;
    case "richText":
      return strRichText(srcNode.items, options);
    case "space":
      return " ";
    case "text":
      return srcNode.text;
    default:
      break;
  }
  return "";
};

const strItems = (
  items: (TextNode | string)[] | undefined,
  options?: OptionsTextFormat,
  divider = ""
): string =>
  (items ?? [])
    .map((node) => (typeof node === "string" ? node : strNode(node, options)))
    .join(divider);

const strOp = (dstText: string, options?: OptionsTextFormat): string => {
  const mode = options?.operations ?? "ascii";
  let result: string | undefined;
  if (mode === "ascii") {
    result = opDictAscii[dstText];
  }
  return result ?? dstText;
};

const opDictAscii: Record<string, string> = {
  "→": "->",
  "—→": "->",
  "↔": "<->",
  "←→": "<->",
  "\u21CC": "<=>",
  "∙": "*",
  "≠": "=/=",
  "←—": "<-",
  "←": "<-",
};

const strExtOp = (
  node: TextNode,
  options: OptionsTextFormat | undefined
): string => {
  const col = splitColumn(node.items);
  let items: (TextNode | string)[] = col.C ?? [];
  const commMode = options?.opComments ?? "text";
  const commCvt = (text: string, where: "above" | "below") => {
    if (commMode === "quoted") return `"${text}"`;
    if (typeof commMode === "function") return commMode(text, where);
    return text;
  };
  if (commMode !== "ignore") {
    if (col.B) {
      const bottom = strItems(col.B, options);
      items = [...items, commCvt(bottom, "below")];
    }
    if (col.T) {
      const top = strItems(col.T, options);
      items = [commCvt(top, "above"), ...items];
    }
  }
  return strItems(items, options);
};

const strRichText = (
  items: TextNode[] | undefined,
  options: OptionsTextFormat | undefined
): string => {
  const s = splitScripts(items);
  const c = strItems(s.C, options);
  return strScripted(s, c, options);
};

const strNodeItem = (
  srcNode: TextNode,
  options: OptionsTextFormat | undefined
): string => {
  const col = splitColumn(srcNode.items ?? []);
  const scripted = splitScripts(col.C ?? []);
  const centerItems: (TextNode | string)[] = scripted.C ?? [];
  const oxMode = options?.oxidationState;
  let center: string | undefined;
  if (col.T && oxMode) {
    if (typeof oxMode === "function") {
      const c = strItems(centerItems, options);
      const oxst = strItems(col.T, options, options?.scriptDivider);
      center = oxMode(c, oxst);
    } else {
      const oxPos = oxMode === "sup" ? "*RT" : oxMode;
      const sPos = oxPosToScript[oxPos as OxidationPos];
      if (sPos) {
        const oldScr = scripted[sPos] ?? [];
        const newScr =
          oxPos[0] === "*" ? [...col.T, ...oldScr] : [...oldScr, ...col.T];
        scripted[sPos] = newScr;
      }
    }
  }
  center = center ?? strItems(centerItems, options);
  return strScripted(scripted, center, options);
};
const oxPosToScript: Record<OxidationPos, ScriptKey> = {
  "*RT": "RT",
  "RT*": "RT",
  "*RB": "RB",
  "RB*": "RB",
  "*LT": "LT",
  "LT*": "LT",
  "*LB": "LB",
  "LB*": "LB",
};

const strScripted = (
  dict: ReturnType<typeof splitScripts>,
  center: string | undefined,
  options: OptionsTextFormat | undefined
): string =>
  [
    strSup(dict.LT, options, true),
    strSub(dict.LB, options, true),
    center ?? strItems(dict.C, options),
    strSub(dict.RB, options),
    strSup(dict.RT, options),
  ].join("");

const strSup = (
  items: TextNode[] | undefined,
  options: OptionsTextFormat | undefined,
  left?: boolean
): string => {
  let res = strItems(items, options, options?.scriptDivider);
  if (res) {
    const sup = options?.sup ?? "withHat";
    if (sup === "withHat") {
      res = `^${res}`;
    } else if (typeof sup === "function") {
      res = sup(res, left);
    }
  }
  return res;
};

const strSub = (
  items: TextNode[] | undefined,
  options: OptionsTextFormat | undefined,
  left?: boolean
): string => {
  let res = strItems(items, options, options?.scriptDivider);
  if (res) {
    const sub = options?.sub;
    if (sub === "withUnderscore") {
      res = `_${res}`;
    } else if (typeof sub === "function") {
      res = sub(res, left);
    }
  }
  return res;
};
