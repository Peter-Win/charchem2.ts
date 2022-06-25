import { isId } from "../parse/scanId";
import { PreProcCtx } from "./PreProcCtx";
import { scanPar } from "./scanPar";

// Хотя names по составу является тем же списком, который можно получить из dict.keys,
// но необходимо гарантировать точный порядок.
// Например в JavaScript такой порядок сохраняется, а C++ или Python - нет
// Поэтому список формальных параметров имеет словарь имя/значение и список имен
export interface MacroParams {
  dict: Record<string, string>;
  names: string[];
}

// Формальные параметры x[:XX]
export const readFormalPars = (ctx: PreProcCtx): MacroParams => {
  const dict: Record<string, string> = {};
  const names: string[] = [];
  if (ctx.n() !== ")") {
    ctx.pos--;
    for (;;) {
      const p0 = ctx.pos;
      const p1 = scanPar(ctx.src, p0);

      if (p1 >= ctx.src.length) {
        ctx.error("Formal params list is not closed");
      }
      const param = ctx.n(p1 - p0); // Получено объявление очередного параметра
      const k = param.indexOf(":");
      const [first, second] =
        k < 0
          ? // без значения по умолчанию
            [param, ""]
          : [param.slice(0, k), param.slice(k + 1)];

      // Контролируем правильность описания названия параметра
      if (!isId(first)) {
        ctx.errorPar("Invalid parameter name: [name]", { name: first });
      }
      dict[first] = second;
      names.push(first);
      const c = ctx.n();
      if (c === ")") break;
    }
  }
  return { dict, names };
};
