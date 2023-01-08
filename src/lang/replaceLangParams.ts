import { ifDef } from "../utils/ifDef";
import { LangParams } from "./LangTypes";

interface ParamsReplaceLangParams {
  text: string;
  params?: LangParams;
  langId?: string;
  tr(key: string, params?: LangParams, langId?: string): string;
}

export const replaceLangParams = (
  fnParams: ParamsReplaceLangParams
): string => {
  const { text, params, langId, tr } = fnParams;
  let result = "";
  let pos = 0;
  const getValue = (key: string) =>
    ifDef(params?.[key], (value) => String(value)) ?? key;
  while (pos >= 0) {
    const begin = text.indexOf("[", pos);
    if (begin < 0) break;
    const end = text.indexOf("]", begin);
    if (end < 0) break;
    result += text.slice(pos, begin);
    const key = text.slice(begin + 1, end);
    // TODO: Пока что укороченный вариант. В дальнейшем возможен вариант со списком параметров после #
    if (key.endsWith("#")) {
      const pureKey = key.slice(0, -1);
      result += tr(getValue(pureKey), {}, langId);
    } else {
      result += getValue(key);
    }
    pos = end + 1;
  }
  return result + text.slice(pos);
  // return paramsList.reduce(
  //   (acc, [name, val]) => acc.replace(`[${name}]`, String(val)),
  //   text
  // );
};
