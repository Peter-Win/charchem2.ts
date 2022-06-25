export const removeItem = <T>(list: T[], item: T) => {
  const pos = list.indexOf(item);
  if (pos >= 0) {
    list.splice(pos, 1);
  }
};
