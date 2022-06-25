export const lastItem = <T>(list?: T[]): T | undefined =>
  list ? list[list.length - 1] : undefined;
