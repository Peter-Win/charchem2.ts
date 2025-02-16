import { Int } from "../types";
import { ChemObj } from "../core/ChemObj";

export const locateAtomNumber = (item: ChemObj): Int | undefined => {
  let num: number | undefined;
  item.walk({
    atom(obj) {
      num = obj.n;
    },
  });
  return num;
};
