/**
 * Whether the property matches the specified description.
 * The description follows the format of the font-face structure fields: fontWeight, fontStyle, fontStretch
 * Examples:
 *      isPropMatch("normal", "all") = true
 *      isPropMatch("condensed", "normal, condensed") = true
 * @param prop see FontTypes.ts
 * @param description Common pattern: all | [a|b|c [, a|b|c]]
 */
export const isPropMatch = <T extends string>(
  prop: T,
  description: string
): boolean => {
  const lowDescr = description.toLowerCase();
  if (lowDescr === "all") {
    return true;
  }
  const lowProp = prop.toLowerCase();
  const list = lowDescr.split(",").map((s) => s.trim());
  return list.indexOf(lowProp) >= 0;
};
