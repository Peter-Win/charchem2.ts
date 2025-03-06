import { isLeftCoeff } from "../../types/CoeffPos";
import { ChemObj } from "../../core/ChemObj";
import { GroupType, TextNode } from "./TextNode";
import { addItemProps } from "./addItemProps";
import { createTextOp } from "./createTextOp";
import { splitRichText } from "./splitRichText";
import { correctBondsDirection } from "./correctBondsDirection";

/* eslint no-param-reassign: "off" */

export const buildTextNodes = (srcExpr: ChemObj): TextNode => {
  const rootNode: TextNode = { type: "group", groupType: "expr" };
  const stack: [TextNode] | TextNode[] = [rootNode];

  const addItemTo = (item: TextNode, owner: TextNode) => {
    owner.items = owner.items ?? [];
    owner.items.push(item);
  };
  const addItem = (item: TextNode) => addItemTo(item, stack[0]);
  const pushLevel = (node: TextNode) => {
    addItem(node);
    stack.unshift(node);
    return node;
  };
  const pushGroupLevel = (groupType?: GroupType) =>
    pushLevel({ type: "group", groupType });
  const popLevel = (): TextNode | undefined => stack.shift();

  let prevEntity: "agent" | "op" | undefined;
  let autoNode = false;
  let firstItem: TextNode | undefined;
  let lastItem: TextNode | undefined;
  let atomColor: string | undefined;
  let itemColor: string | undefined;

  const addSpace = (curEntityType: "agent" | "op") => {
    if (prevEntity) {
      const node: TextNode = {
        type: "space",
        spaceType: "agentOp",
      };
      if (prevEntity === "agent" && curEntityType === "agent") {
        node.spaceType = "agentAgent";
      } else if (prevEntity === "op" && curEntityType === "op") {
        node.spaceType = "opOp";
      }
      addItem(node);
    }
    prevEntity = curEntityType;
  };

  srcExpr.walk({
    agentPre(obj) {
      addSpace("agent");
      pushGroupLevel("agent");
      if (obj.n.isSpecified())
        addItem({
          type: "k",
          k: obj.n,
          kType: "agent",
          color: obj.n.color,
        });
    },
    agentPost() {
      correctBondsDirection(stack[0]);
      popLevel();
    },
    atom(obj) {
      if (autoNode) return;
      addItem({
        type: "atom",
        atom: obj,
        color: atomColor ?? itemColor,
      });
    },
    bond(obj) {
      addItem({ type: "bond", bond: obj, color: obj.color });
    },
    bracketBegin(obj) {
      pushLevel({
        type: "brackets",
        color: obj.color,
      });
      pushGroupLevel();
      addItem({
        type: "bracket",
        text: obj.text,
        begin: true,
        color: obj.color,
      });
    },
    bracketEnd(obj) {
      addItem({
        type: "bracket",
        text: obj.text,
        begin: false,
        color: obj.color,
      });
      correctBondsDirection(stack[0]);
      // Есть особый случай, когда buildTextNode вызывается непосредственно для ChemBtacketEnd
      if (stack.length > 1) popLevel();
      if (obj.n.isSpecified())
        addItem({
          type: "k",
          k: obj.n,
          kType: "bracket",
          pos: isLeftCoeff(obj.n.pos) ? "LB" : "RB",
        });
      if (obj.charge)
        addItem({
          type: "charge",
          charge: obj.charge,
          pos: obj.charge.isLeft ? "LT" : "RT",
        });
      popLevel();
    },
    comma() {
      addItem({ type: "comma" });
    },
    comment(obj) {
      addItem({
        type: "comment",
        comment: obj,
        items: [splitRichText(obj.text, itemColor)],
        color: itemColor,
      });
    },
    custom(obj) {
      addItem({
        type: "custom",
        custom: obj,
        items: [splitRichText(obj.text, itemColor)],
        color: itemColor,
      });
    },
    itemPre(obj) {
      if (autoNode) return;
      itemColor = obj.color;
      atomColor = obj.atomColor;
      const itemNode = pushLevel({
        type: "item",
        item: obj,
        color: obj.color,
      });
      firstItem = firstItem || itemNode;
      lastItem = itemNode;
    },
    itemPost(obj) {
      if (autoNode) return;
      addItemProps(obj, addItem);
      popLevel();
    },
    mul(obj) {
      if (!obj.isFirst)
        addItem({
          type: "mul",
          color: obj.color,
        });
      pushGroupLevel();
      if (obj.n.isSpecified()) {
        addItem({ type: "k", k: obj.n, kType: "mul" });
      }
    },
    mulEnd() {
      popLevel();
    },
    nodePre(obj) {
      firstItem = undefined;
      lastItem = undefined;
      autoNode = obj.autoMode;
      pushGroupLevel("node");
    },
    nodePost(obj) {
      popLevel();
      if (obj.charge) {
        const { isLeft } = obj.charge;
        const itemNode = isLeft ? firstItem : lastItem;
        if (itemNode) {
          addItemTo(
            {
              type: "charge",
              charge: obj.charge,
              pos: isLeft ? "LT" : "RT",
            },
            itemNode
          );
        }
      }
    },
    operation(obj) {
      addSpace("op");
      addItem(createTextOp(obj));
    },

    radical(obj) {
      addItem({
        type: "radical",
        radical: obj,
        color: itemColor,
      });
    },
  });

  return rootNode;
};
