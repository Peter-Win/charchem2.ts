import { LangParams } from "../lang";
import { ElemList } from "../core/ElemList";

/* eslint no-bitwise: "off" */

export const checkElementsMatching = (
  parts: [ElemList, ElemList]
): [string, LangParams | undefined] | undefined => {
  for (let j = 0; j !== 2; j++) {
    const first = parts[j];
    const second = parts[j ^ 1];
    if (!first || !second) {
      return ["Invalid expression", undefined];
    }
    for (const elem of first.list) {
      if (!second.findRec(elem)) {
        // Не найден элемент
        const partId = `${j === 0 ? "right" : "left"}|part`;
        return ["[E] is missing in [S] part", { E: elem.id, S: partId }];
      }
    }
  }
  return undefined;
};
