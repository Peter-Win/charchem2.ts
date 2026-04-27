export const getItemForced = <K extends string | number, V>(
  record: Record<K, V>,
  key: K,
  defaultValue: V | (() => V),
): V => {
  const existingValue = record[key];
  if (existingValue !== undefined) return existingValue;
  const newValue: V =
    // @ts-ignore
    typeof defaultValue === "function" ? defaultValue() : defaultValue;

  record[key] = newValue;
  return newValue;
};
