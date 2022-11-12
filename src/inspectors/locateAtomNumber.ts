import { Int } from "../types";
import { ChemObj } from "../core/ChemObj";

export const locateAtomNumber = (item: ChemObj): Int => {
  let num = 0;
  item.walk({
    atom(obj) {
      num = obj.n;
    },
  });
  return num;
};
