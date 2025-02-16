import { ifDef } from "../../utils/ifDef";
import { specCharsB } from "../../compiler/parse/comment";

/**
 * Replace unicode-symbols to TeX-commands.
 * Опытным путём выявлено, что так TeX-процессоры лучше обрабатывают код.
 * Вызывать после escapeTex, т.к. после замены появятся TeX-команды.
 * @param src
 * @returns
 */
export const replaceSpecialTeXSymbols = (src: string): string => {
  const { regEx, dict } = getData();
  return src.replace(regEx, (m) => ifDef(dict[m], (c) => `\\${c} `) ?? m);
};

let cacheDict: Record<string, string> | undefined;
let cacheRegEx = /([↑])/g;

const getData = (): {
  dict: Record<string, string>;
  regEx: RegExp;
} => {
  if (!cacheDict) {
    const d: Record<string, string> = {
      "↑": "uparrow",
      "↓": "downarrow",
      // "°": "degree", - not supported by MathJax
    };
    Object.entries(specCharsB).forEach(([cmd, uChar]) => {
      d[uChar] = cmd;
    });
    cacheDict = d;
    const codes = Object.keys(d).join("");
    cacheRegEx = new RegExp(`([${codes}])`, "g");
  }
  return {
    dict: cacheDict,
    regEx: cacheRegEx,
  };
};
