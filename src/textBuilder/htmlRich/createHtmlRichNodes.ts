import { addAll } from "../../utils/addAll";
import { TextNode } from "../buildTextNodes";
import { splitColumn } from "../buildTextNodes/splitColumn";
import { splitScripts } from "../buildTextNodes/splitScripts";
import { XmlNode } from "../xmlNode/XmlNode";
import { HtmlRichClass, htmlRichCls } from "./HtmlRichClasses";
import { HtmlRichMap } from "./HtmlRichMap";
import { OptionsHtmlRich } from "./OptionsHtmlRich";
import { addClassToXmlNode } from "../xmlNode/addClassToXmlNode";
import { makeCchTag } from "./makeCchTag";
import { cchOperation } from "./cchOperation";
import { textInsideTag } from "../../utils/xml/textInsideTag";

/*
 Приняты следующие допущения.
 Агент.
 - все вложенные конструкции (узлы и скобки) раскрываются в плоский список элементов
 - не предполагается наличие подстрочных индексов
 - надстрочными индексами считаются только степени окисления
 - если есть хотя бы один надстрочный индекс, то у сверху резервируется padding,
   а сами индексы выводятся при помощи position:absolute. 
   padding нужен, чтобы они не вылезали за границы формулы.
*/

export type CtxHtmlRich = {
  options?: OptionsHtmlRich;
  srcMap?: HtmlRichMap;
};

export const createHtmlRichNodes = (
  srcNode: TextNode,
  ctx: CtxHtmlRich
): XmlNode[] => {
  const textTag = (content: string, cls?: HtmlRichClass) => [
    makeCchTag({ ctx, srcNode, content, cls }),
  ];
  switch (srcNode.type) {
    case "atom":
      return textTag(srcNode.atom.id);
    case "bond":
      return textTag(bondMap[srcNode.bond.tx] ?? srcNode.bond.tx);
    case "bracket":
      return textTag(srcNode.text);
    case "brackets":
      return makeScripted(srcNode, ctx, (nodes) => nodesList(nodes, ctx));
    case "charge":
      return makeCharge(srcNode, srcNode.charge.text, ctx);
    case "column":
      if (srcNode.columnType === "op") return makeComplexOp(srcNode, ctx);
      return [];
    case "comma":
      return textTag(",");
    case "comment":
      return makeRichText(srcNode, ctx);
    case "custom":
      return [
        makeCchTag({
          ctx,
          srcNode,
          cls: "symbols",
          content: nodesList(srcNode.items, ctx),
        }),
      ];
    case "group":
      if (srcNode.groupType === "node" || !srcNode.groupType) {
        return nodesList(srcNode.items, ctx);
      }
      return makeGroup(srcNode, srcNode.groupType, ctx);
    case "item":
      return makeItem(srcNode, ctx);
    case "k":
      return textTag(
        srcNode.k.toString(),
        srcNode.kType === "agent" ? "agent-k" : undefined
      );
    case "mul":
      return textTag("∙", "mul");
    case "op":
      return [cchOperation(ctx, srcNode, srcNode.op)];
    case "radical":
      return textTag(srcNode.radical.label);
    case "richText":
      return makeRichText(srcNode, ctx);
    case "space":
      return []; // implemented by gap in .cch-expr
    case "text":
      return textTag(textInsideTag(srcNode.text));
    default:
      break;
  }
  return [];
};

const bondMap: Record<string, string> = {
  "-": "–",
};

const nodesList = (
  items: TextNode[] | undefined,
  ctx: CtxHtmlRich
): XmlNode[] =>
  (items ?? []).map((it) => createHtmlRichNodes(it, ctx)).flatMap((it) => it);

const hasOver = (srcNode: TextNode): boolean => {
  if (srcNode.type === "item") {
    return (srcNode.items ?? []).some((it) => it.pos === "T");
  }
  return (srcNode.items ?? []).some(hasOver);
};

const makeGroup = (
  srcNode: TextNode,
  groupType: string | undefined,
  ctx: CtxHtmlRich
): XmlNode[] => {
  let cls: HtmlRichClass | HtmlRichClass[] | undefined;
  if (groupType === "expr") {
    cls = "expr";
  } else if (groupType === "agent") {
    cls = ["agent"];
    if (hasOver(srcNode)) cls.push("has-over");
  }
  return [
    makeCchTag({
      ctx,
      srcNode,
      cls,
      content: () => nodesList(srcNode.items, ctx),
    }),
  ];
};

const optionalGroup = (
  list: TextNode[] | undefined,
  ctx: CtxHtmlRich,
  cls?: HtmlRichClass | HtmlRichClass[]
): XmlNode => {
  let tag: XmlNode | undefined;
  if (list?.length === 1) {
    const n = nodesList(list, ctx);
    if (n.length === 1) tag = n[0]!;
  }
  if (!tag) {
    tag = makeCchTag({
      ctx,
      srcNode: undefined,
      content: () => nodesList(list, ctx),
    });
  }
  if (cls) {
    addClassToXmlNode(tag, htmlRichCls(cls));
  }
  return tag;
};

const makeItem = (srcNode: TextNode, ctx: CtxHtmlRich): XmlNode[] => {
  // Если нужно оптимизировать количество тегов, то конечно лучше выдавать result
  // Но если нужно иметь возможность при наведении курсора находить элемент узла, то нужен дополнительный тег
  const content = () =>
    makeScripted(srcNode, ctx, (items) => makeColumn(splitColumn(items), ctx));
  if (!ctx.srcMap) {
    return content();
  }
  return [
    makeCchTag({
      ctx,
      srcNode,
      content,
      cls: "node-item",
    }),
  ];
};

const makeScripted = (
  srcNode: TextNode,
  ctx: CtxHtmlRich,
  makeCenter: (items: TextNode[]) => XmlNode[]
): XmlNode[] => {
  const { items = [] } = srcNode;
  const result: XmlNode[] = [];
  const scr = splitScripts(items);
  const addScripts = (
    top: TextNode[] | undefined,
    bottom: TextNode[] | undefined,
    left: boolean
  ) => {
    result.push(
      makeCchTag({
        ctx,
        srcNode: undefined,
        cls: left ? ["supsub", "supsub-left"] : "supsub",
        content: () => [optionalGroup(top, ctx), optionalGroup(bottom, ctx)],
      })
    );
  };
  if (scr.LT || scr.LB) addScripts(scr.LT, scr.LB, true);
  if (scr.C) {
    addAll(result, makeCenter(scr.C));
  }
  if (scr.RT || scr.RB) addScripts(scr.RT, scr.RB, false);
  return result;
};

const makeColumn = (
  col: ReturnType<typeof splitColumn>,
  ctx: CtxHtmlRich
): XmlNode[] => {
  if (!col.T && !col.B) {
    return nodesList(col.C, ctx);
  }
  const colItems: XmlNode[] = [optionalGroup(col.C, ctx)];
  let cls: HtmlRichClass | undefined;
  if (col.T) {
    cls = "over";
    colItems.push(optionalGroup(col.T, ctx));
  }
  const box = makeCchTag({
    ctx,
    srcNode: undefined,
    cls,
    content: colItems,
  });
  return [box];
};

const makeCharge = (
  srcNode: TextNode,
  chargeText: string,
  ctx: CtxHtmlRich
): XmlNode[] => {
  const create = (value: string) => {
    if (value === "-") {
      return makeCchTag({
        ctx,
        srcNode: undefined,
        cls: "minus",
        content: "–",
      });
    }
    return makeCchTag({ ctx, content: value, srcNode: undefined });
  };
  return [
    makeCchTag({
      ctx,
      srcNode,
      cls: "charge",
      content: chargeText.includes("-")
        ? () => splitChargeText(chargeText, create)
        : chargeText,
    }),
  ];
};

const splitChargeText = (
  text: string,
  create: (value: string) => XmlNode
): XmlNode[] =>
  text
    .split(/(-)/)
    .filter((s) => !!s)
    .map(create);

const makeRichText = (srcNode: TextNode, ctx: CtxHtmlRich): XmlNode[] => {
  const scr = splitScripts(srcNode.items ?? []);
  if (!scr.RB && !scr.RT) {
    return nodesList(scr.C, ctx);
  }
  return [
    makeCchTag({
      ctx,
      srcNode,
      cls: "symbols",
      content: () => [
        ...nodesList(scr.C, ctx),
        makeCchTag({
          ctx,
          srcNode: undefined,
          cls: "supsub",
          content: () => [
            optionalGroup(scr.RT, ctx),
            optionalGroup(scr.RB, ctx),
          ],
        }),
      ],
    }),
  ];
};

const opComment = (ctx: CtxHtmlRich, items: TextNode[]): XmlNode =>
  makeCchTag({
    ctx,
    srcNode: undefined,
    cls: "op-comment",
    content: () => nodesList(items, ctx),
  });

const opContainer = (
  ctx: CtxHtmlRich,
  srcNode: TextNode,
  cls: HtmlRichClass,
  content: () => XmlNode[]
): XmlNode[] => [makeCchTag({ ctx, srcNode, cls, content })];

const makeComplexOp = (srcNode: TextNode, ctx: CtxHtmlRich): XmlNode[] => {
  const { C: center, T: top, B: bottom } = splitColumn(srcNode.items ?? []);
  const opCode = (): XmlNode => optionalGroup(center, ctx, "op-code");
  if (top && bottom) {
    return opContainer(ctx, srcNode, "op-both", () => [
      opComment(ctx, top),
      opCode(),
      opComment(ctx, bottom),
    ]);
  }
  if (top) {
    return opContainer(ctx, srcNode, "op-head", () => [
      opComment(ctx, top),
      opCode(),
    ]);
  }
  if (bottom) {
    return opContainer(ctx, srcNode, "op-footer", () => [
      opCode(),
      opComment(ctx, bottom),
    ]);
  }
  return [];
};
