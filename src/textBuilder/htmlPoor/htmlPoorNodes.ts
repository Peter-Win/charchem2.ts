import { ChemOp } from "../../core/ChemOp";
import { addAll } from "../../utils/addAll";
import { TextNode } from "../buildTextNodes";
import { splitColumn } from "../buildTextNodes/splitColumn";
import { splitScripts } from "../buildTextNodes/splitScripts";
import { XmlNode } from "../xmlNode/XmlNode";
import { OptionsHtmlPoor, PoorHtmlPart, stdTagsMap } from "./OptionsHtmlPoor";
import { textInsideTag } from "../../utils/xml/textInsideTag";

export const htmlPoorNodes = (
  srcNode: TextNode,
  options?: OptionsHtmlPoor
): XmlNode[] | undefined => createHtmlPoorNodes(srcNode, options);

const createHtmlPoorNodes = (
  node: TextNode,
  ctx: OptionsHtmlPoor | undefined
): XmlNode[] | undefined => {
  const textTag = (content: string, tag: string = "span"): XmlNode[] => [
    { tag, color: node.color, content },
  ];
  switch (node.type) {
    case "atom":
      return textTag(node.atom.id);
    case "bond":
      return textTag(node.bond.tx);
    case "bracket":
      return textTag(node.text);
    case "brackets":
      return makeScripted(node, ctx, (items) => nodesList(items, ctx));
    case "charge":
      return textTag(node.charge.text);
    case "column":
      if (node.columnType === "op") return makeComplexOp(node, ctx);
      break;
    case "comma":
      return textTag(",");
    case "comment":
      return optGroupTag(specTag("comment", ctx), node.color, node.items, ctx);
    case "custom":
      return optGroupTag(specTag("custom", ctx), node.color, node.items, ctx);
    case "group":
      return nodesList(node.items, ctx);
    case "item":
      return makeItem(node, ctx);
    case "k":
      return textTag(
        node.k.toString(),
        node.kType === "agent" ? specTag("agentK", ctx) : undefined
      );
    case "mul":
      return textTag("∙");
    case "op":
      return operationCode(node, node.op);
    case "radical":
      return textTag(node.radical.label);
    case "richText":
      return makeRichText(node, ctx);
    case "space":
      return textTag(" ");
    case "text":
      return textTag(textInsideTag(node.text));
    default:
      break;
  }
  return undefined;
};

const nodesList = (
  items: TextNode[] | undefined,
  ctx: OptionsHtmlPoor | undefined
): XmlNode[] =>
  (items ?? [])
    .map((it) => createHtmlPoorNodes(it, ctx) ?? [])
    .flatMap((it) => it);

const optGroupTag = (
  tag: string,
  color: string | undefined,
  items: TextNode[] | undefined,
  ctx: OptionsHtmlPoor | undefined
): XmlNode[] => {
  const content = nodesList(items, ctx);
  if (content.length === 0) return [];
  return [{ tag, color, content }];
};

const specTag = (
  type: PoorHtmlPart,
  ctx: OptionsHtmlPoor | undefined
): string => {
  if (!ctx?.tags || ctx?.tags === "std") {
    return stdTagsMap[type] ?? "span";
  }
  return "span";
};

const makeScripted = (
  srcNode: TextNode,
  ctx: OptionsHtmlPoor | undefined,
  makeCenter: (items: TextNode[]) => XmlNode[]
): XmlNode[] => {
  const { items = [] } = srcNode;
  const scr = splitScripts(items);
  return [
    ...optGroupTag("sup", undefined, scr.LT, ctx),
    ...optGroupTag("sub", undefined, scr.LB, ctx),
    ...(scr.C ? makeCenter(scr.C) : []),
    ...optGroupTag("sub", undefined, scr.RB, ctx),
    ...optGroupTag("sup", undefined, scr.RT, ctx),
  ];
};

const operationCode = (node: TextNode, op: ChemOp): XmlNode[] => [
  { tag: "span", color: node.color, content: op.dstText },
];

const makeComplexOp = (
  node: TextNode,
  ctx: OptionsHtmlPoor | undefined
): XmlNode[] => {
  const { C, T, B } = splitColumn(node.items ?? []);
  const mode = ctx?.opComments ?? "text";
  const result: XmlNode[] = [];
  const onComment = (textNodes: TextNode[] | undefined, scriptTag: string) => {
    if (mode !== "ignore") {
      if (mode === "script") {
        result.push({
          tag: scriptTag,
          content: nodesList(textNodes, ctx),
        });
      } else {
        addAll(result, nodesList(textNodes, ctx));
      }
    }
  };
  onComment(T, "sup");
  addAll(result, nodesList(C, ctx));
  onComment(B, "sub");
  return result;
};

const makeItem = (
  srcNode: TextNode,
  ctx: OptionsHtmlPoor | undefined
): XmlNode[] => [
  {
    tag: "span",
    content: makeScripted(srcNode, ctx, (items) => {
      const col = splitColumn(items);
      return [
        ...nodesList(col.C, ctx),
        ...(col.T && ctx?.oxidationState === "sup"
          ? optGroupTag("sup", undefined, col.T, ctx)
          : []),
      ];
    }),
  },
];

const makeRichText = (
  node: TextNode,
  ctx: OptionsHtmlPoor | undefined
): XmlNode[] => {
  const scr = splitScripts(node.items ?? []);
  const center = nodesList(scr.C, ctx);
  if (!scr.RB && !scr.RT) {
    return center;
  }
  return [
    {
      tag: "span",
      color: node.color,
      content: [
        ...center,
        ...optGroupTag("sub", undefined, scr.RB, ctx),
        ...optGroupTag("sup", undefined, scr.RT, ctx),
      ],
    },
  ];
};
