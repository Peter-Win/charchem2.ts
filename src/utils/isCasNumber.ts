/*
 * https://en.wikipedia.org/wiki/CAS_Registry_Number
 * A CAS RN is separated by hyphens into three parts,
 * the first consisting from two up to seven digits,
 * the second consisting of two digits,
 * and the third consisting of a single digit serving as a check digit.
 */

const rxCas = /^\d{1,7}-\d{1,2}-\d$/;

export const isCasNumber = (value: string): boolean => {
  // common pattern
  if (!rxCas.test(value)) return false;
  // checksum
  const numbers: number[] = Array.from(value.slice(0, -1))
    .map((c) => +c)
    .filter((n) => !Number.isNaN(n));
  numbers.reverse();
  const checksum = numbers.reduce((sum, n, i) => sum + n * (i + 1), 0);
  return +value.slice(-1) === checksum % 10;
};
