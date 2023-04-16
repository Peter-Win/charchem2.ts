export const cmp = <T>(a: T, b: T): -1 | 0 | 1 => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

export const cmpLess =
  <T>(less: (first: T, second: T) => boolean) =>
  (a: T, b: T): -1 | 0 | 1 => {
    if (less(a, b)) return -1;
    if (less(b, a)) return 1;
    return 0;
  };
