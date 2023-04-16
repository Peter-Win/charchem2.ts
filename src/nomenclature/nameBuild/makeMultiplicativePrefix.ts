/**
 * Blue Book v2 P-14.2.1
 * Локализация использует словарь. Числовые слоги используют суффикс _num
 */

import { Lang } from "../../lang";
import { ChemError } from "../../core/ChemError";

const thousands = [
  "ki",
  "di",
  "tri",
  "tetra",
  "penta",
  "hexa",
  "hepta",
  "octa",
  "nona",
];
const hundreds = [
  "he",
  "di",
  "tri",
  "tetra",
  "penta",
  "hexa",
  "hepta",
  "octa",
  "nona",
];
const tens = [
  "deca",
  "icosa",
  "tria",
  "tetra",
  "penta",
  "hexa",
  "hepta",
  "octa",
  "nona",
];
const units = [
  "hen",
  "do",
  "tri",
  "tetra",
  "penta",
  "hexa",
  "hepta",
  "octa",
  "nona",
];
const vowels = new Set("aeiou".split(""));

export const makeMultiplicativePrefix = (value: number): string[] => {
  const n = Math.round(value);
  if (n <= 0 || n >= 10000)
    throw new ChemError("Invalid multiplicative prefix: [n]", { n });

  // P-14.2.1.1.1 When alone, the numerical term for the number ‘1’ is ‘mono’ and that for ‘2’ is ‘di’.
  if (n === 1) return ["mono"];
  if (n === 2) return ["di"];

  const chunks: string[] = [];

  const hx = n % 1000;
  const t = Math.floor(n / 1000);
  if (t) {
    chunks.push(thousands[t - 1]!, "lia");
  }
  const h = Math.floor(hx / 100);
  const dx = hx % 100;
  if (h) {
    chunks.unshift(hundreds[h - 1]!, "cta");
  }
  if (dx === 11) {
    chunks.unshift("deca");
    chunks.unshift("un");
  } else {
    const d = Math.floor(dx / 10);
    if (d) {
      if (d > 2) chunks.unshift("conta");
      chunks.unshift(tens[d - 1]!);
    }
    const u = dx % 10;
    if (u) {
      chunks.unshift(units[u - 1]!);
    }
  }
  // The letter ‘i’ in ‘icosa’ is elided after a vowel
  if (
    chunks.length >= 2 &&
    chunks[1] === "icosa" &&
    vowels.has(chunks[0]!.slice(-1))
  ) {
    chunks[1] = chunks[1]!.slice(1);
  }
  return chunks;
};

/**
 * P-14.2.2 Numerical terms for compound or complex features
Multiplicative prefixes for compound or complex entities, such as substituted substituents, are formed by adding the 
ending ‘kis’ to the basic multiplicative prefix ending in ‘a’, ‘tetrakis’, ‘pentakis’, etc. (ref. 15). The prefixes ‘bis’ and 
‘tris’ correspond to ‘di’ and ‘tri’. The basic prefix ‘mono’ has no counterpart in this series.
 * @param value 
 * @returns 
 */
export const makeMultiplicativePrefixKis = (value: number): string[] => {
  if (value === 1) return ["mono"];
  if (value === 2) return ["bis"];
  if (value === 3) return ["tris"];
  return [...makeMultiplicativePrefix(value), "kis"];
};

const asmDict: Record<number, string> = {
  2: "bis",
  3: "ter",
  4: "quater",
  5: "quinque",
  6: "sexi",
  7: "septi",
  8: "octi",
  9: "novi",
  10: "deci",
};

/**
 * P-14.2.3 Multiplicative prefixes for naming assemblies of identical units
 * The traditional prefixes used to denote the number of repeated identical units in unbranched ring assemblies (see P-28)
 * @param value
 * @returns
 */
export const makeMultiplicativePrefixAsm = (value: number): string[] => {
  const text = asmDict[value];
  if (text) {
    return [text];
  }
  const chunks = makeMultiplicativePrefix(value);
  const n = chunks.length - 1;
  if (n >= 0) {
    const last = chunks[n]!;
    chunks[n] = `${last.slice(0, -1)}i`;
  }
  return chunks;
};

const trNumChunk = (text: string, lang?: string) =>
  Lang.tr(`${text}_num`, undefined, lang);

export const trNumChunks = (prefix: string[], lang?: string): string =>
  prefix.map((t) => trNumChunk(t, lang)).join("");
