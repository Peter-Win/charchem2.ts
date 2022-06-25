import { isId } from "../parse/scanId";
import { globalMacros } from "./Macros";
import { PreProcCtx } from "./PreProcCtx";
import { MacroParams, readFormalPars } from "./readFormalPars";
import { scanPar } from "./scanPar";

export const applyParamValues = (
  def: MacroParams,
  params: string[],
  ctx: PreProcCtx
): PreProcCtx => {
  if (def.names.length === 0) {
    return ctx;
  }
  let curIndex = 0;
  // Подставляем фактические значения
  params.forEach((paramValue) => {
    const k = paramValue.indexOf(":");
    let ready = false;
    if (k >= 0) {
      const id = paramValue.slice(0, k);
      if (id in def.dict) {
        def.dict[id] = paramValue.slice(k + 1);
        ready = true;
      }
    }
    if (!ready) {
      const name = def.names[curIndex++];
      // Индексный параметр может быть пропущен, если пуст.
      // Тогда вместо него будет использовано значение по умолчанию
      if (name !== undefined && !!paramValue) {
        def.dict[name] = paramValue;
      }
    }
  });
  // Замена параметров на значения
  ctx.writeFinish();
  const exl = ctx.dst.split("&");
  exl.slice(1).forEach((s, index) => {
    const i = index + 1;
    const id = def.names.reduce(
      (prev, f) =>
        s.slice(0, Math.min(f.length, s.length)) === f && f.length > prev.length
          ? f
          : prev,
      ""
    );
    // Если в формуле встретился знак &, с которым не связан ни один параметр, пропускаем
    if (id) {
      // Замена параметра на значение
      exl[i] = def.dict[id] + exl[i]!.slice(id.length);
    }
  });
  return new PreProcCtx(exl.join(""));
};

export const readRealParams = (ctx: PreProcCtx): string[] => {
  const result: string[] = [];
  if (ctx.n() !== ")") {
    ctx.pos--;
    do {
      const p0 = ctx.pos;
      const p1 = scanPar(ctx.src, p0);
      if (p1 >= ctx.src.length) {
        ctx.error("Real params list is not closed");
      }
      result.push(ctx.n(p1 - p0));
    } while (ctx.n() !== ")");
  }
  return result;
};

// Исполнение макроса
// params - индексный список фактических параметров, в тексте которых могут быть имена
// так сделано из-за того, что до вызова точно не известно число формальных параметров
export const execMacros = (src: string, params: string[]): string => {
  const ctx0 = new PreProcCtx(src);
  // Извлечение формальных параметров
  const p = readFormalPars(ctx0);
  const ctx1 = applyParamValues(p, params, ctx0);
  // Расшифровка всех макросов @A()
  for (;;) {
    const c = ctx1.search("@");
    if (c === undefined) {
      ctx1.writeFinish();
      break;
    }
    // Встречено объявление. Это может быть только конструкция @A
    ctx1.write(c);
    const name = ctx1.searchEx("(");
    if (!isId(name)) {
      ctx1.errorPar("Invalid macro [name]", { name });
    }
    const macro = globalMacros[name];
    if (macro) {
      // Извлечение фактических параметров
      const realParams = readRealParams(ctx1);
      ctx1.write(execMacros(macro.body, realParams));
    } else ctx1.errorPar("Macros not found: [name]", { name });
  }
  return ctx1.dst;
};
