export const addAllSet = <T>(container: Set<T>, appends: Set<T>) =>
  Array.from(appends).forEach((it) => container.add(it));
