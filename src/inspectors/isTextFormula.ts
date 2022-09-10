import { ChemObj } from "../core/ChemObj";

export const isTextFormula = (chemObj: ChemObj): boolean => {
  const visitor = chemObj.walkExt({
    isStop: false as boolean,
    bond(obj) {
      this.isStop = !obj.isText;
    },
    itemPre(obj) {
      this.isStop = !!obj.dots;
    },
  });
  return !visitor.isStop;
};
