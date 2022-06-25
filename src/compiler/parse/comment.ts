import { Lang } from "../../lang/Lang";
import { Char } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { ChemComment } from "../../core/ChemComment";
import { scanTo } from "./scan";

export const createComment = (compiler: ChemCompiler): ChemComment => {
  const src = scanComment(compiler);
  const dst = convertComment(src);
  compiler.pos++;
  return new ChemComment(dst);
};

/** Извлекает комментарий
 * Изначально pos должен быть установлен на первый символ внутри кавычек
 * В конце он установлен на завершающую кавычку
 */
const scanComment = (compiler: ChemCompiler): string => {
  const pos0 = compiler.pos;
  if (!scanTo(compiler, '"')) {
    compiler.error("Comment is not closed", { pos: pos0 - 1 });
  }
  return compiler.subStr(pos0);
};

const replaceLimited = (
  text: string,
  firstLimiter: Char,
  lastLimiter: Char,
  transform: (s: string) => string | undefined
): string => {
  let i = 0;
  let result = text;
  while (i < result.length) {
    const beginPos = result.indexOf(firstLimiter, i);
    if (beginPos < 0 || beginPos === result.length) break;
    const endPos = result.indexOf(lastLimiter, beginPos + 1);
    if (endPos < 0) break;
    const key = result.slice(beginPos + 1, endPos);
    const value = transform(key);
    if (value !== undefined) {
      // соответствие найдено. Выполняем замену
      result = result.slice(0, beginPos) + value + result.slice(endPos + 1);
      i = beginPos + value.length;
    } else {
      // соответствие не найдено. Оставляем скобки в тексте
      i = beginPos + 1;
    }
  }
  return result;
};

// Часто встречающиеся символы.
// Внедряются в текст без каких-то синтаксических ограничителей.
// Этот список не рекомендуется расширять, т.к. это снижает производительность
const specChars: [RegExp, string][] = [
  [/\|\^/g, "↑"],
  [/ArrowUp/g, "↑"],
  [/\|v/g, "↓"],
  [/ArrowDown/g, "↓"],
  [/\^o/g, "°"],
];

// Выполнить подстановку специальных символов:
// - часто встречающиеся символы типа градуса или стрелки.
// - символы в квадратных скобках. (греческие буквы)
// - фразы для локализации в обратных апострофах
const convertComment = (text: string): string => {
  // замена частых символов
  let result: string = specChars.reduce(
    (acc, [first, second]) => acc.replace(first, second),
    text
  );

  // замена символов в квадратных скобках.
  result = replaceLimited(result, "[", "]", (it) => specCharsB[it]);
  // Перевод фраз из словаря
  result = replaceLimited(result, "`", "`", (it) => Lang.findPhrase(it) ?? it);
  return result;
};

// Символы в квадратных скобках.
// Здесь можно добавлять другие символы без снижения производительности.
// (на производительность влияет размер текста и количество скобок в нем)

const specCharsB: Record<string, string> = {
  alpha: "α",
  Alpha: "Α",
  beta: "β",
  Beta: "Β",
  gamma: "γ",
  Gamma: "Γ",
  delta: "δ",
  Delta: "Δ",
  epsilon: "ε",
  Epsilon: "Ε",
  zeta: "ζ",
  Zeta: "Ζ",
  eta: "η",
  Eta: "Η",
  theta: "θ",
  Theta: "Θ",
  iota: "ι",
  Iota: "Ι",
  kappa: "κ",
  Kappa: "Κ",
  lambda: "λ",
  Lambda: "Λ",
  mu: "μ",
  Mu: "Μ",
  nu: "ν",
  Nu: "Ν",
  xi: "ξ",
  Xi: "Ξ",
  omicron: "ο",
  Omicron: "Ο",
  pi: "π",
  Pi: "Π",
  rho: "ρ",
  Rho: "Ρ",
  sigma: "σ",
  Sigma: "Σ",
  tau: "τ",
  Tau: "Τ",
  upsilon: "υ",
  Upsilon: "Υ",
  phi: "φ",
  Phi: "Φ",
  chi: "χ",
  Chi: "Χ",
  psi: "ψ",
  Psi: "Ψ",
  omega: "ω",
  Omega: "Ω",
};
