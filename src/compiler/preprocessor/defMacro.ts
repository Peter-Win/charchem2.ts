// определение нового макроса
// имя, формальные параметры, тело
// если завершение @; то ничего не выводится
// если (... , то выводится @name(...

import { isIdFirstChar } from "../parse/scanId";
import { bodyPreprocess } from "./bodyPreprocess";
import { globalMacros, Macros } from "./Macros";
import { PreProcCtx } from "./PreProcCtx";

export const defMacro = (ctx: PreProcCtx) => {
  const p0 = ctx.pos;
  const name = ctx.searchEx("(");
  if (!isIdFirstChar(name[0]!)) {
    ctx.error("Invalid macro name", p0);
  }
  const macro = new Macros(name);

  // считывание тела макроса
  // параметры читаются вместе с телом и разбираются при каждом вызове
  // это даёт возможность включить в них параметры вышестоящего макроса
  ctx.push();
  bodyPreprocess(ctx);
  macro.body = ctx.pop();
  // анализ окончания
  const c = ctx.n();
  if (c === "(") {
    // Окончание с вызовом
    ctx.write(`@${name}${c}`);
  } else if (c !== ";") {
    ctx.error("Invalid macros end");
  }
  globalMacros[name] = macro;
};
