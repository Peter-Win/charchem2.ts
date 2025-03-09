import { TextNode } from "../buildTextNodes";
import { buildCharChemTextNodes } from "./buildCharChemTextNodes";
import { addFunc, CCTFunc, CCTNode, funcStr } from "./CCTNode";

/* eslint no-param-reassign: "off" */

export const buildCharChemText = (srcNode: TextNode): string => {
  const dstNode = buildCharChemTextNodes(srcNode);

  const flatList: CCTNode[] = [];
  correctItemColor(dstNode);
  makeFlat(dstNode, flatList);
  setFlatColors(flatList);
  setAtomColors(flatList);
  return cctn2str(dstNode);
};

const cctn2str = ({ content, funcs }: CCTNode): string => {
  let code: string =
    typeof content === "string" ? content : content.map(cctn2str).join("");
  if (funcs) {
    code = funcs.map(funcStr).join("") + code;
  }
  return code;
};

const correctItemColor = (node: CCTNode) => {
  const { content, colorType, color } = node;
  if (
    colorType === "item" &&
    Array.isArray(content) &&
    content[0]?.colorType === "atom" &&
    content[0]?.color !== color
  ) {
    content[0].atomColor = content[0].color;
    content.forEach((subNode) => {
      subNode.color = color;
    });
  }
  if (Array.isArray(content)) {
    content.forEach(correctItemColor);
  }
};

const setAtomColors = (list: CCTNode[]) => {
  const atoms = list.filter(({ colorType }) => colorType === "atom");
  type Group = {
    first: CCTNode;
    count: number;
    color: string | undefined;
    type?: "single" | "none";
  };
  const groups: Group[] = [];
  let prevGroup: Group | undefined;
  atoms.forEach((node) => {
    if (!prevGroup || prevGroup.color !== node.atomColor) {
      prevGroup = {
        first: node,
        color: node.atomColor === node.color ? undefined : node.atomColor,
        count: 1,
      };
      groups.push(prevGroup);
    } else {
      prevGroup.count++;
    }
  });
  prevGroup = undefined;
  groups.forEach((gr) => {
    if (prevGroup?.count === 1 && !gr.color) {
      prevGroup.type = "single";
      gr.type = "none";
    }
    prevGroup = gr;
  });
  if (groups[0] && !groups[0].color) {
    groups[0].type = "none";
  }
  groups.forEach(({ first, color, type }) => {
    if (type !== "none") {
      const fn: CCTFunc =
        type === "single"
          ? {
              name: "atomColor1",
              params: [color ?? ""],
            }
          : {
              name: "atomColor",
              params: [color ?? ""],
            };
      addFunc(first, fn);
    }
  });
};

const makeFlat = (node: CCTNode, flatList: CCTNode[]) => {
  if (Array.isArray(node.content)) {
    node.content.forEach((it) => makeFlat(it, flatList));
  } else {
    flatList.push(node);
  }
};

const setFlatColors = (flatList: CCTNode[]) => {
  let prevColor: string | undefined;
  flatList.forEach((node) => {
    const { color } = node;
    if (prevColor !== color) {
      addFunc(node, {
        name: "color",
        params: color ? [color] : [],
      });
      prevColor = color;
    }
  });
};
