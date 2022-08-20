import { Int } from "../types";
import { ChemObj } from "../core/ChemObj";
import { RulesBase } from "../textRules/RulesBase";
import { ChemCharge } from "../core/ChemCharge";
import { ifDef } from "../utils/ifDef";
import { compile } from "../compiler/compile";
import { rulesText } from "../textRules/rulesText";

interface Chunk {
  text: string;
  color?: string;
}

class StackItem {
  l2r: boolean = true;

  chunks: Chunk[] = [];

  add(chunk: Chunk) {
    if (this.l2r) {
      this.chunks.push(chunk);
    } else {
      this.chunks.unshift(chunk);
    }
  }
}

const locateAtomNumber = (item: ChemObj): Int => {
  let num = 0;
  item.walk({
    atom(obj) {
      num = obj.n;
    },
  });
  return num;
};

/**
 * Сформировать текстовое представление химической формулы.
 * Не все формулы могут быть представлены в виде текста.
 * Поэтому перед вызовом этой функции нужно использовать isTextFormula
 */
export const makeTextFormula = (
  chemObj: ChemObj,
  rules: RulesBase = rulesText
): string => {
  const stack: StackItem[] = [new StackItem()];
  let itemColor: string | undefined;
  let atomColor: string | undefined;

  const push = () => {
    stack.unshift(new StackItem());
  };

  const pop = () => {
    if (stack.length === 1) {
      return;
    }
    const item = stack.shift()!;
    const top = stack[0]!;
    if (top.l2r) {
      top.chunks = [...top.chunks, ...item.chunks];
    } else {
      top.chunks = [...item.chunks, ...top.chunks];
    }
  };

  const ctxOut = (text: string, color?: string) =>
    stack[0]!.add({ text, color });

  const space = () => ctxOut(" ");

  const drawCharge = (
    charge: ChemCharge | undefined,
    isPrefix: boolean,
    color?: string
  ) =>
    ifDef(charge, (it) => {
      if (isPrefix === it.isLeft) {
        ctxOut(rules.nodeCharge(it), color);
      }
    });

  let autoNode = false;

  chemObj.walk({
    agentPre(obj) {
      space();
      push();
      if (obj.n.isSpecified()) {
        ctxOut(rules.agentK(obj.n));
      }
    },
    agentPost() {
      pop();
    },
    atom(obj) {
      if (!autoNode) {
        ctxOut(rules.atom(obj.id), atomColor ?? itemColor);
      }
    },

    bond(obj) {
      stack[0]!.l2r = !obj.isNeg;
      ctxOut(obj.tx, obj.color);
    },

    comma() {
      ctxOut(rules.comma(), itemColor);
    },

    comment(obj) {
      ctxOut(rules.comment(obj.text), itemColor);
    },

    custom(obj) {
      ctxOut(rules.custom(obj.text), itemColor);
    },

    itemPre(obj) {
      if (autoNode) return;
      itemColor = obj.color;
      atomColor = obj.atomColor;
      const rawAtomNum = obj.atomNum;
      if (rawAtomNum) {
        // Вывести двухэтажную конструкцию: масса/атомный номер слева от элемента
        const atomNum = rawAtomNum >= 0 ? rawAtomNum : locateAtomNumber(obj);
        ctxOut(rules.itemMassAndNum(obj.mass, atomNum), itemColor);
      } else if (obj.mass !== 0.0) {
        ctxOut(rules.itemMass(obj.mass), itemColor);
      }
    },

    itemPost(obj) {
      if (autoNode) return;
      if (obj.n.isSpecified()) ctxOut(rules.itemCount(obj.n), itemColor);
    },

    nodePre(obj) {
      push();
      drawCharge(obj.charge, true, itemColor);
      if (obj.autoMode) {
        autoNode = true;
      }
    },

    nodePost(obj) {
      drawCharge(obj.charge, false, itemColor);
      autoNode = false;
      pop();
    },

    operation(obj) {
      space();
      ctxOut(rules.operation(obj), obj.color);
    },

    radical(obj) {
      ctxOut(rules.radical(obj.label), itemColor);
    },

    bracketBegin(obj) {
      push();
      drawCharge(obj.end?.charge, true, obj.color);
      ctxOut(obj.text, obj.color);
    },

    bracketEnd(obj) {
      const { color } = obj.begin;
      ctxOut(obj.text, color);
      if (obj.n.isSpecified()) ctxOut(rules.itemCount(obj.n), color);
      drawCharge(obj.charge, false, color);
      pop();
    },

    mul(obj) {
      if (!obj.isFirst) ctxOut(rules.mul(), obj.color);
      if (obj.n.isSpecified()) ctxOut(rules.mulK(obj.n), obj.color);
    },
  });
  const nonOptimized = buildTextFromChunks(stack[0]!.chunks, rules).trim();
  return rules.postProcess(nonOptimized);
};

const buildTextFromChunks = (chunks: Chunk[], rules: RulesBase): string => {
  const tags = chunks.map((chunkItem, index) => {
    let result = chunkItem.text;
    const { color } = chunkItem;
    if (color) {
      const needOpen = index === 0 || color !== chunks[index - 1]!.color;
      const needClose =
        index === chunks.length - 1 || color !== chunks[index + 1]!.color;
      if (needOpen) result = rules.colorBegin(color) + result;
      if (needClose) result += rules.colorEnd();
    }
    return result;
  });
  return tags.reduce((acc: string, tag) => acc + tag, "");
};

export const makeTextFormulaSrc = (
  sourceText: string,
  rules: RulesBase
): string => {
  const expr = compile(sourceText);
  if (!expr.isOk()) return "";
  return makeTextFormula(expr, rules);
};
