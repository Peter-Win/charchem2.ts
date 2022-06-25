export const listToDict = <TValue, TKey extends string | number>(
  list: TValue[],
  makeKey: (v: TValue) => TKey
): Record<TKey, TValue> =>
  list.reduce(
    (dict, item) => ({ ...dict, [makeKey(item)]: item }),
    {} as Record<TKey, TValue>
  );
