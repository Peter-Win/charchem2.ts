export const scanMarkupEnd = (
  text: string,
  start: number,
  stopper: string
): number => {
  let level = 0;
  let pos = start;
  while (pos < text.length) {
    const ch = text[pos++];
    if (ch === stopper && level <= 0) break;
    if (ch === "{") level++;
    else if (ch === "}") level--;
  }
  return pos;
};
