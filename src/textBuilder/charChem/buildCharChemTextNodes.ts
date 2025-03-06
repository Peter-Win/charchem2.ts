import { isShortRadical } from "../../core/ChemRadical";
import { CoeffType, TextNode } from "../buildTextNodes";
import { addFunc, CCTNode } from "./CCTNode";

/* eslint no-param-reassign: "off" */

export const buildCharChemTextNodes = (srcNode: TextNode): CCTNode => {
  const dstNode: CCTNode = {
    content: [],
  };
  onTextNode(srcNode, dstNode);
  return dstNode;
};

const add = (dstNode: CCTNode, newNode: CCTNode) => {
  if (Array.isArray(dstNode.content)) {
    dstNode.content.push(newNode);
  }
};

const enum Order {
  agent = -2,
  mul = -1,
  commPre = -1,
  commPost = 1,
  oxi,
  coeff,
  charge,
}

const onTextNode = (srcNode: TextNode, dstNode: CCTNode) => {
  const addText = (content: string, order?: number) => {
    add(dstNode, {
      color: srcNode.color,
      content,
      order,
    });
  };
  switch (srcNode.type) {
    case "space":
      addText(" ");
      return;
    case "atom":
      add(dstNode, {
        colorType: "atom",
        color: srcNode.color,
        content: srcNode.atom.id,
      });
      dstNode.atom = srcNode.atom;
      return;
    case "bond":
      addText(fromDict(srcNode.bond.tx, bondDict));
      return;
    case "bracket":
      addText(fromDict(srcNode.text, brackets));
      return;
    case "brackets":
      onGroup(srcNode, dstNode);
      return;
    case "charge":
      addText(
        (chargePosDict[srcNode.pos ?? ""] ?? "^@").replace(
          "@",
          srcNode.charge.text.toLowerCase()
        ),
        srcNode.pos === "T" ? Order.oxi : Order.charge
      );
      return;
    case "column":
      if (srcNode.columnType === "op") {
        onGroup(srcNode, dstNode);
      }
      break;
    case "comma":
      addText(",");
      return;
    case "comment":
      addText(`"${srcNode.comment.text}"`);
      return;
    case "custom":
      addText(`{${srcNode.custom.text}}`);
      return;
    case "group":
      onGroup(srcNode, dstNode);
      return;
    case "item":
      onItem(srcNode, dstNode);
      return;
    case "k":
      if (srcNode.kType === "mass") {
        dstNode.mass = srcNode.k;
      } else if (srcNode.kType === "atomNum") {
        dstNode.atomNum = srcNode.k;
      } else {
        addText(
          (srcNode.pos === "LB" ? "`" : "") +
            (srcNode.k.isNumber()
              ? srcNode.k.toString()
              : `'${srcNode.k.toString()}'`),
          kOrder[srcNode.kType] ?? Order.coeff
        );
      }
      return;
    case "mul":
      addText("*");
      return;
    case "op":
      addText(srcNode.op.srcText);
      return;
    case "radical":
      {
        const { label } = srcNode.radical;
        addText(isShortRadical(label) ? label : `{${label}}`);
      }
      return;
    case "richText":
      if (srcNode.src && (srcNode.pos === "T" || srcNode.pos === "B")) {
        addText(
          `"${srcNode.src}"`,
          srcNode.pos === "T" ? Order.commPre : Order.commPost
        );
      }
      break;
    // case "text":
    //   break;
    default:
      break;
  }
};

const fromDict = (key: string, dict: Record<string, string>): string =>
  dict[key] ?? key;

const bondDict: Record<string, string> = {
  "≡": "%",
};

const kOrder: Partial<Record<CoeffType, Order>> = {
  agent: Order.agent,
  mul: Order.mul,
};

const chargePosDict: Record<string, string> = {
  T: "(@)",
  LT: "`^@",
};
const brackets: Record<string, string> = {
  "{": "{{",
  "}": "}}",
};

const onGroup = (srcNode: TextNode, dstNode: CCTNode) => {
  const group = {
    content: [],
  } satisfies CCTNode;
  add(dstNode, group);
  srcNode.items?.forEach((node) => onTextNode(node, group));
  group.content.sort(cmpOrder);
};

const onItem = (srcNode: TextNode, dstNode: CCTNode) => {
  const itemNode: CCTNode = {
    colorType: "item",
    color: srcNode.color,
    content: [],
  };
  add(dstNode, itemNode);
  srcNode?.items?.forEach((node) => {
    onTextNode(node, itemNode);
  });
  if (Array.isArray(itemNode.content)) {
    itemNode.content.sort(cmpOrder);
    const chargePos = itemNode.content.findIndex(
      ({ order }) => order === Order.charge
    );
    if (chargePos >= 0) {
      add(dstNode, itemNode.content[chargePos]!);
      itemNode.content.splice(chargePos, 1);
    }
  }
  if (itemNode.mass) {
    if (itemNode.atomNum) {
      const params: string[] = [itemNode.mass.toString()];
      if (!itemNode.atom) {
        params.push(itemNode.atomNum.toString());
      }
      addFunc(itemNode, {
        name: "nM",
        params,
      });
    } else {
      addFunc(itemNode, {
        name: "M",
        params: [itemNode.mass.toString()],
      });
    }
  }
};

const cmpOrder = (a: CCTNode, b: CCTNode) => (a.order ?? 0) - (b.order ?? 0);
