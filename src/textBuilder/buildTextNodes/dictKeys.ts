export const dictKeys = (dict: Record<string, unknown>): string =>
  Object.entries(dict)
    .filter(([, value]) => value !== undefined)
    .map(([key]) => key)
    .sort()
    .join(",");
