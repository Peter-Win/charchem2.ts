export const cmp = <T>(a: T, b: T): number => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};
