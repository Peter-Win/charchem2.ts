import { textInsideTag } from "../../utils/xml/textInsideTag";
import { splitColumn } from "../buildTextNodes/splitColumn";
import { TextNode } from "../buildTextNodes/TextNode";
import { FnNodeToXml } from "../xmlNode/FnNodeToXml";
import { XmlNode } from "../xmlNode/XmlNode";
import { CtxCreateMathMLNode } from "./CtxCreateMathMLNode";
import { mathColumn } from "./utils/mathColumn";
import { mathItem } from "./utils/mathItem";
import { mathOptRow } from "./utils/mathOptRow";
import { mathRichText } from "./utils/mathRichText";
import { mathScripted } from "./utils/mathScripted";
import { mathText } from "./utils/mathText";
import { onNodeItem } from "./utils/onNodeItem";

const customNode = (
  srcNode: TextNode,
  ctx: CtxCreateMathMLNode
): XmlNode | undefined => {
  // в отличие от comment, тут основной тег mi
  const customCtx = {
    ...ctx,
    textMode: "custom",
  } satisfies CtxCreateMathMLNode;
  return mathOptRow(srcNode.items ?? [], (node: TextNode) =>
    createMathMLNode(node, customCtx)
  );
};

export const createMathMLNode = (
  srcNode: TextNode,
  ctx: CtxCreateMathMLNode
): XmlNode | undefined => {
  let dstNode: XmlNode | undefined;
  const create: FnNodeToXml = (node: TextNode) => createMathMLNode(node, ctx);
  const { color } = srcNode;
  switch (srcNode.type) {
    case "atom":
      dstNode = mathItem(srcNode.atom.id, color);
      break;
    case "charge":
      dstNode = mathText(
        { ...ctx, textMode: "charge" },
        srcNode.charge.text,
        color
      );
      break;
    case "column":
      dstNode = mathColumn(splitColumn(srcNode.items ?? []), create);
      break;
    case "comma":
      dstNode = { tag: "mo", content: ",", color };
      break;
    case "custom":
      dstNode = customNode(srcNode, ctx);
      break;
    case "bond":
      {
        const { tx } = srcNode.bond;
        dstNode = {
          tag: "mo",
          content: tx === "-" ? "–" : tx,
          color,
          attrs: { lspace: "0", rspace: "0" },
        };
      }
      break;
    case "bracket":
      dstNode = { tag: "mo", content: srcNode.text, color };
      break;
    case "brackets":
      dstNode = mathScripted(srcNode.items ?? [], create);
      break;
    case "item":
      dstNode = onNodeItem(srcNode, create);
      break;
    case "k":
      dstNode = {
        tag: srcNode.k.isNumber() ? "mn" : "mi",
        content: srcNode.k.toString(),
        color,
      };
      break;
    case "mul":
      // Google Chrome 132.0.6834.84 dont understand &sdot; and &#x22c5;
      dstNode = { tag: "mo", content: "\u22c5", color };
      break;
    case "op":
      dstNode = {
        tag: "mo",
        content: stdOp(srcNode.op.srcText, srcNode.op.dstText),
      };
      break;
    case "radical":
      dstNode = mathItem(srcNode.radical.label, color);
      break;
    case "richText":
      dstNode = mathRichText(srcNode, create);
      break;
    case "space":
      dstNode =
        srcNode.spaceType === "agentOp"
          ? undefined
          : { tag: "mspace", attrs: { width: "0.5em" } };
      break;
    case "text":
      dstNode = mathText(ctx, textInsideTag(srcNode.text), color);
      break;
    default:
      dstNode = mathOptRow(srcNode.items ?? [], create);
      break;
  }
  return dstNode;
};

export const stdOpsDict: Record<string, string> = {
  "-->": "\u27F6",
  "--|>": "→",
  "->": "→",
  "®": "→",
  "<->": "↔",
  "<-->": "↔",
  "<=>": "⇌",
  "<==>": "\u21CC",
  "!=": "≠",
  "<-": "←",
  "<--": "\u2190",
  "<|--": "←",
};

export const stdOp = (srcText: string, dstText: string): string =>
  stdOpsDict[srcText] ?? dstText;
