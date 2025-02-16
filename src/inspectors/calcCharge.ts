import { Double } from "../types";
import { ChemObj } from "../core/ChemObj";

/**
 * Вычисление заряда объекта.
 * Используется для объектов от узла и выше.
 * При наличии абстрактных коэффициентов возвращается NaN
 */
export const calcCharge = (chemObj: ChemObj): Double => {
  const stack: Double[] | [Double] = [0.0];
  const push = () => {
    stack.unshift(0.0);
  };

  const pop = (calc: () => Double) => {
    const value: Double = stack[0]! * calc();
    stack.shift();
    stack[0] += value;
  };

  chemObj.walk({
    agentPre() {
      push();
    },
    agentPost(obj) {
      pop(() => obj.n.num);
    },
    bracketBegin() {
      push();
    },
    bracketEnd(obj) {
      const { charge } = obj;
      if (charge) {
        stack[0] = charge.value;
      }
      pop(() => obj.n.num);
    },

    // TODO: Пока нет поддержки множителей

    nodePost(obj) {
      // Ниже уровня узла заряд не проверяем
      const { charge } = obj;
      if (charge) {
        stack[0] += charge.value;
      }
    },
  });
  return stack[0]!;
};
