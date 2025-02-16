import { ifDef } from "../../utils/ifDef";
import { parseColorCss } from "../../utils/color/parseColorCss";
import { getRgbSamples } from "../../utils/color/getRgbSamples";
import { CoeffType, TextNode } from "../buildTextNodes";
import { cloneTextNode } from "../buildTextNodes/cloneTextNode";
import { optimizeColors } from "../buildTextNodes/optimizeColors";
import { splitColumn } from "../buildTextNodes/splitColumn";
import { ScriptKey, splitScripts } from "../buildTextNodes/splitScripts";
import { findNearestColor, texColors } from "./texColors";
import { replaceSpecialTeXSymbols } from "./replaceSpecialTeXSymbols";

export type TeXOptions = {
  scripts?: "optimal" | "braces";
  colors?: "original" | "predefined" | "dvips";
  noMhchem?: boolean; // dont use mhchem
  comments?: "CharChem" | "TeX"; // TeX comments can only be used if all formulas are guaranteed to be output via TeX.
};

type CtxTeX = TeXOptions & {
  extOp: boolean;
};

export const buildTeX = (srcNode: TextNode, options?: TeXOptions): string => {
  const dstNode = cloneTextNode(srcNode);
  optimizeColors(dstNode, ({ items }) => items);
  const res = createTexFromNode(dstNode, { ...options, extOp: false });
  // \ce{} is mhchem extension
  // https://mhchem.github.io/MathJax-mhchem/
  return options?.noMhchem ? `\\mathrm{${res}}` : `\\ce{${res}}`;
};

export const createTexFromNode = (node: TextNode, ctx: CtxTeX): string => {
  switch (node.type) {
    case "atom":
      return texColor(node.atom.id, node.color, ctx);
    case "bond":
      return texColor(node.bond.tx, node.color, ctx);
    case "bracket":
      return texColor(node.text.replace(/([{}])/g, "\\$1"), node.color, ctx);
    case "brackets":
      return texColor(
        onScripted(splitScripts(node.items ?? []), node.color, ctx),
        node.color,
        ctx
      );
    case "charge":
      return texColor(node.charge.text, node.color, ctx);
    case "column":
      if (node.columnType === "op") return onComplexOp(node, ctx);
      return onColumn(node, node.color, ctx);
    case "comma":
      return ",";
    case "comment":
      return applyRichText(node, node.comment.text, ctx);
    case "custom":
      return applyRichText(node, node.custom.text, ctx);
    case "group":
      return onGroup(node.items, node.color, ctx);
    case "item":
      return onItem(node, ctx);
    case "k":
      return onCoeff(node.k.toString(), node.kType, node.color, ctx);
    case "mul":
      return ctx.noMhchem ? " \\cdot " : "*";
    case "op":
      return stdOp(node.op.srcText, node.op.srcText, ctx);
    case "radical":
      return texColor(escapeTex(node.radical.label), node.color, ctx);
    case "richText":
      return onRichText(node, ctx);
    case "space":
      return " ";
    case "text":
      return texColor(
        replaceSpecialTeXSymbols(escapeTex(node.text)),
        node.color,
        ctx
      );
    default:
      break;
  }
  return "";
};

const onCoeff = (
  text: string,
  type: CoeffType,
  color: string | undefined,
  ctx: CtxTeX
): string => {
  let k = texColor(text, color, ctx);
  if (ctx.noMhchem && type === "agent") {
    k += "\\,";
  }
  return k;
};

export const getTexColor = (color: string | undefined, ctx: CtxTeX): string => {
  if (!color) return "";
  let dstColor = color;
  const inPredefined = ctx?.colors === "predefined";
  if (ctx?.colors === "dvips" || inPredefined) {
    const cc = parseColorCss(color);
    if (cc) {
      const s = getRgbSamples(cc);
      if (s) {
        const i = findNearestColor(s.r, s.g, s.b, inPredefined);
        // eslint-disable-next-line prefer-destructuring
        dstColor = texColors[i]![0];
        if (inPredefined) dstColor = dstColor.toLowerCase();
      }
    }
  }
  return dstColor;
};

const texColor = (text: string, color: string | undefined, ctx: CtxTeX) => {
  const dstColor = getTexColor(color, ctx);
  return dstColor ? `{\\color{${dstColor}}${text}}` : text;
};

const onGroup = (
  items: TextNode[] | undefined,
  color: string | undefined,
  ctx: CtxTeX
): string =>
  texColor(
    items?.map((it) => createTexFromNode(it, ctx)).join("") ?? "",
    color,
    ctx
  );

type CmdCode = "^" | "_";

const optimizedCmd = (cmd: CmdCode, param: string, ctx: CtxTeX): string => {
  if ((!ctx.scripts || ctx.scripts === "optimal") && param.length === 1) {
    return `${cmd}${param}`;
  }
  return `${cmd}{${param}}`;
};

const onScripted = (
  s: ReturnType<typeof splitScripts>,
  color: string | undefined,
  ctx: CtxTeX
): string => {
  let res = "";
  const onCmd = (cmd: CmdCode, pos: ScriptKey) => {
    if (s[pos]) {
      res += optimizedCmd(cmd, onGroup(s[pos], color, ctx), ctx);
    }
  };
  onCmd("^", "LT");
  onCmd("_", "LB");
  res += onGroup(s.C, color, ctx);
  onCmd("^", "RT");
  onCmd("_", "RB");
  return res;
};

const onColumnExt = (
  center: TextNode[] | string | undefined,
  top: TextNode[] | string | undefined,
  bottom: TextNode[] | string | undefined,
  color: string | undefined,
  ctx: CtxTeX
) => {
  const cvtParam = (param: TextNode[] | string) =>
    Array.isArray(param) ? onGroup(param, color, ctx) : param;
  const op = (
    cmd: "overset" | "underset",
    secondary: TextNode[] | string,
    primary: TextNode[] | string
  ) => `\\${cmd}{${cvtParam(secondary)}}{${cvtParam(primary)}}`;

  const c = center ?? "";
  if (top && bottom) {
    return op("overset", top, op("underset", bottom, c));
  }
  if (top) {
    return op("overset", top, c);
  }
  if (bottom) {
    return op("underset", bottom, c);
  }
  return cvtParam(c);
};

const onColumn = (
  node: TextNode,
  color: string | undefined,
  ctx: CtxTeX
): string => {
  const col = splitColumn(node.items ?? []);
  return onColumnExt(col.C, col.T, col.B, color, ctx);
};

const onItem = (node: TextNode, ctx: CtxTeX): string => {
  const col = splitColumn(node.items ?? []);
  const center = onScripted(splitScripts(col.C ?? []), undefined, ctx);
  return texColor(
    onColumnExt(center, col.T, col.B, undefined, ctx),
    node.color,
    ctx
  );
};

const onComplexOp = (node: TextNode, ctx0: CtxTeX): string => {
  const ctx: CtxTeX = { ...ctx0 };
  const d = splitColumn(node.items ?? []);
  const complex = isComplexOp(d.C);
  const mhchem = !ctx0.noMhchem;
  if (complex && !mhchem) ctx.extOp = true;
  let above: string | undefined;
  let below: string | undefined;
  const opNode = node.items?.find(({ type }) => type === "op");
  if (opNode?.type === "op" && ctx0.comments === "TeX") {
    const { op } = opNode;
    above = op.commentPre?.text;
    below = op.commentPost?.text;
  } else {
    above = onGroup(d.T, node.color, ctx);
    below = onGroup(d.B, node.color, ctx);
  }
  let res = onGroup(d.C, node.color, ctx);
  if (mhchem) {
    if (above || below) res += `[${above || ""}]`;
    if (below) res += `[${below}]`;
  } else if (complex) {
    // example: \xrightarrow[under]{over}
    if (below) res += `[${below}]`;
    res += `{${above || ""}}`;
  }
  return res;
};

const applyRichText = (node: TextNode, text: string, ctx: CtxTeX): string => {
  if (ctx.comments === "TeX") return replaceSpecialTeXSymbols(text);
  return onGroup(node.items, node.color, ctx);
};

const onRichText = (node: TextNode, ctx: CtxTeX) => {
  const scripted = splitScripts(node.items ?? []);
  return onScripted(scripted, node.color, ctx);
};

const escapeTex = (text: string): string =>
  text.replace(/\\/g, "\\backslash ").replace(/([{}\[\]])/g, "\\$1");

export const mhchemOpsDict: Record<string, string> = {
  "-->": "->",
  "--|>": "->",
  "->": "->",
  "®": "→",
  "<->": "<->",
  "<-->": "<->",
  "<=>": "⇌",
  "<==>": "<-->",
  "!=": "\\ne",
  "<-": "<-",
  "<--": "<-",
  "<|--": "<-",
};

export const stdOp = (
  srcText: string,
  dstText: string,
  ctx: CtxTeX
): string => {
  if (!ctx.noMhchem) {
    return mhchemOpsDict[srcText] ?? dstText;
  }
  if (ctx.extOp) {
    const op = texComplexOps[srcText];
    if (op) return `\\${op}`;
  }
  return ifDef(texSimpleOps[srcText], (op) => `\\${op}`) ?? dstText;
};

const texSimpleOps: Record<string, string> = {
  "->": "rightarrow",
  "-->": "longrightarrow",
  "--|>": "longrightarrow",
  "®": "rightarrow",
  "<->": "leftrightarrow",
  "<-->": "longleftrightarrow",
  "<=>": "rightleftarrows",
  "<==>": "rightleftarrows",
  "!=": "ne",
  "<-": "leftarrow",
  "<--": "longleftarrow",
  "<|--": "longleftarrow",
};

const texComplexOps: Record<string, string> = {
  "->": "xrightarrow",
  "®": "xrightarrow",
  "-->": "xrightarrow",
  "--|>": "xrightarrow",
  "<->": "xleftrightarrow",
  "<-->": "xleftrightarrow",
  "<=>": "xrightleftharpoons",
  "<==>": "xrightleftharpoons", // not supported by MathJax
  "<-": "xleftarrow",
  "<--": "xleftarrow",
  "<|--": "xleftarrow",
};

const isComplexOp = (nodes: TextNode[] | undefined): boolean => {
  if (nodes?.length !== 1 || !nodes[0]) return false;
  const [node] = nodes;
  return node.type === "op" && !!texComplexOps[node.op.srcText];
};
