import { isIdFirstChar } from "../parse/scanId";
import { defMacro } from "./defMacro";
import { PreProcCtx } from "./PreProcCtx";

// Функция, которая ищет конец макроопределения. При этом, на вывод не идут объявления @:
// Конструкция @:A()...@() заменяется на @A()
// Окончание либо по концу буфера, либо по конструкции, отличающейся от @: и @A

export const bodyPreprocess = (ctx: PreProcCtx) => {
  for (;;) {
    const plain = ctx.search("@");
    if (plain === undefined) {
      // макросов больше нет
      ctx.writeFinish(); // пишем остаток строки и заканчиваем обработку
      break;
    }
    ctx.write(plain); // Выводим предшествующий текст
    const c = ctx.n(); // Следующий символ
    if (c === ":") {
      // Объявление нового макроса
      defMacro(ctx);
    } else if (isIdFirstChar(c[0]!)) {
      // вызов существующего макроса
      ctx.write(`@${c}`);
    } else {
      // Остальные символы расцениваются как окончание тела. их разбор делает вызывающий код
      ctx.pos--;
      break;
    }
  }
};
