export const addAll = <T>(container: T[], appends: T[]) =>
  appends.forEach((it) => appends.push(it));
