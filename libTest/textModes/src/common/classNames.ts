type ClassName = string | [boolean, string] | null | undefined;
/**
 * Forming a composite class for a jsx element with the ability to specify conditions
 * @param names
 */
export const classNames = (names: ClassName[]): string =>
  names
    .filter((name) => (Array.isArray(name) ? name[0] : !!name))
    .map((name) => (Array.isArray(name) ? name[1] : name))
    .join(" ");
