import { bodyPreprocess } from "./bodyPreprocess";
import { execMacros } from "./execMacros";
import { PreProcCtx } from "./PreProcCtx";

export const mainPreProcess = (src: string): string => {
  // основной алгоритм выполнения препроцессора для заданной строки
  const ctx = new PreProcCtx(src);
  bodyPreprocess(ctx);
  if (ctx.pos !== src.length) {
    ctx.error("Invalid preprocessor finish");
  }
  const dummyBody = `)${ctx.dst}`;
  return execMacros(dummyBody, []);
};
