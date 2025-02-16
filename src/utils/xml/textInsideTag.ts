/**
 * If you need to keep spaces at the ends, you need to replace them with special characters.
 * Otherwise, they will be ignored during output.
 *
 * Also, you can't use names like &nbsp; here. Because they will be escaped.
 *
 * @param text
 * @returns
 */
export const textInsideTag = (text: string): string =>
  text.replace(/\s+/g, " ").replace(/(^ )|( $)/g, "\u00A0");
