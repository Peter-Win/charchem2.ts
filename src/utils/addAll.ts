export const addAll = <T>(container: T[], appends: readonly T[]) =>
  appends.forEach((it) => container.push(it));
