import { Int } from "../../types";
import { ChemError } from "../../core/ChemError";
import { LangParams } from "../../lang/Lang";

export class PreProcCtx {
  src: string = "";

  dst: string = "";

  pos: Int = 0;

  readonly stack: string[] = [];

  constructor(ctx: PreProcCtx);

  constructor(aSrc: string);

  constructor(aSrc: string, aPos: Int);

  constructor(aSrc: PreProcCtx | string, aPos?: Int) {
    if (aSrc instanceof PreProcCtx) {
      this.src = aSrc.src;
      this.pos = aSrc.pos;
    } else {
      this.src = aSrc;
      if (aPos !== undefined) this.pos = aPos;
    }
  }

  error(msg: string, errPos: Int = 0): never {
    if (errPos !== 0) {
      this.pos = errPos < 0 ? this.pos + errPos : errPos;
    }
    throw new ChemError(msg, { pos: this.pos });
  }

  // eslint-disable-next-line class-methods-use-this
  errorPar(msg: string, params: LangParams): never {
    throw new ChemError(msg, params);
  }

  // считать указанное число символов
  n(count: Int = 1): string {
    if (count === 0) {
      return "";
    }
    if (this.pos + count > this.src.length) {
      this.error("Unexpected end of macros");
    }
    const start = this.pos;
    this.pos += count;
    return this.src.slice(start, this.pos);
  }

  // поиск подстроки
  search(cond: string): string | undefined {
    const start = this.pos;
    const stop = this.src.indexOf(cond, start);
    if (stop < 0) {
      return undefined;
    }
    this.pos = stop + cond.length;
    return this.src.slice(start, stop);
  }

  searchEx(cond: string): string {
    return (
      this.search(cond) ??
      this.errorPar("Expected [cond] character in macros", { cond })
    );
  }

  // Достигнут ли конец?
  end(): boolean {
    return this.pos < this.src.length;
  }

  // вывод в dst
  write(text: string) {
    this.dst += text;
  }

  // Записать в выходной буфер остаток исходной строки (от pos до конца)
  writeFinish() {
    this.write(this.src.slice(this.pos));
    this.pos = this.src.length;
  }

  push() {
    this.stack.unshift(this.dst);
    this.dst = "";
  }

  pop(): string {
    const tmp = this.dst;
    this.dst = this.stack.shift() || "";
    return tmp;
  }

  clear() {
    this.dst = "";
  }
}
