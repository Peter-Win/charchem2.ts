import { Double } from "../types";
import { ChemObj } from "../core/ChemObj";
/**
 * Вычисление массы указанного химического объекта.
 * @param chemObj Любой химический объект (выражение, агент, узел и т.п.)
 * @param applyAgentK Если указать false, то игнорируются коэффициенты агентов.
 *
 * Примечание 1. Рекомендуется использовать функцию isAbstract прежде чем вызывать calcMass.
 * Т.к. если в состав объекта входят абстрактные элементы, то результат непредсказуем.
 * Никакого исключения при этом не генерируется.
 * Например, для выражения {R}-OH мы получим сумму масс O и H
 *
 * Примечание 2. Эта функция не слишком полезна для выражений с несколькими агентами.
 * Поэтому для выражений ChemExpr рекомендуется использовать метод mass.
 */
export const calcMass = (
  chemObj: ChemObj,
  applyAgentK: boolean = true
): Double => {
  const stack: Double[] = [0.0];
  const push = () => {
    stack.unshift(0.0);
  };
  const pop = (calc: () => Double) => {
    const value: Double = stack[0]! * calc();
    stack.shift();
    stack[0]! += value;
  };

  chemObj.walk({
    agentPre() {
      push();
    },

    agentPost(obj) {
      pop(() => (applyAgentK ? obj.n.num : 1.0));
    },

    mul() {
      push();
    },
    mulEnd(obj) {
      pop(() => obj.begin.n.num);
    },

    bracketBegin() {
      push();
    },
    bracketEnd(obj) {
      pop(() => obj.n.num);
    },

    nodePre() {
      push();
    },
    nodePost() {
      pop(() => 1.0);
    },

    itemPre() {
      push();
    },
    itemPost(obj) {
      if (obj.mass !== 0.0) {
        // явно указанная масса $M() более приоритетна, чем вычисленная
        stack[0] = obj.mass;
      }
      pop(() => obj.n.num);
    },

    atom(obj) {
      stack[0] += obj.mass;
    },

    radical(obj) {
      obj.items.list.forEach((listItem) => {
        stack[0] += listItem.n * (listItem.elem?.mass ?? 0.0);
      });
    },
  });
  return stack[0]!;
};
