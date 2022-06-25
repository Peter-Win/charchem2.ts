import { Double } from "../types";
import { ChemObj } from "../core/ChemObj";
import { ElemList } from "../core/ElemList";
/**
 * Формирование списка элементов из выражения.
 * Не учитываются коэффициенты агентов.
 * Не имеет смысла для выражений, имеющих более одного агента.
 */
export const makeElemList = (chemObj: ChemObj): ElemList => {
  const stack: ElemList[] = [new ElemList()];
  const push = () => {
    stack.unshift(new ElemList());
  };
  const pop = (k: Double) => {
    const list = stack.shift()!;
    list.scale(k);
    stack[0]!.addList(list);
  };

  chemObj.walk({
    agentPre() {
      push();
    },
    agentPost(obj) {
      pop(obj.n.num);
    },

    nodePost(obj) {
      stack[0]!.charge += obj.charge?.value ?? 0.0;
    },

    bracketBegin() {
      push();
    },
    bracketEnd(obj) {
      const { charge } = obj;
      if (charge) {
        stack[0]!.charge = charge.value;
      }
      pop(obj.n.num);
    },

    mul() {
      push();
    },
    mulEnd(obj) {
      pop(obj.begin.n.num);
    },

    itemPre() {
      push();
    },
    itemPost(obj) {
      pop(obj.n.num);
    },
    atom(obj) {
      stack[0]!.addAtom(obj);
    },
    custom(obj) {
      stack[0]!.addCustom(obj.text);
    },
    radical(obj) {
      stack[0]!.addRadical(obj);
    },
  });
  return stack[0]!;
};
