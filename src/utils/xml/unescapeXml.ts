const dict: Record<string, string> = {
  apos: "'",
  quot: '"',
  amp: "&",
  lt: "<",
  gt: ">",
  nbsp: "\u00A0",
};

export const unescapeXml = (escaped: string): string => {
  let right = escaped;
  let left = "";

  for (;;) {
    const res = /&([^;]*);/.exec(right);
    if (!res) break;
    const substr = res[0]!;
    const c = res[1]!;
    let v = c;
    if (c[0] === "#") {
      if (c[1] === "x") {
        v = String.fromCharCode(Number.parseInt(c.slice(2), 16));
      } else {
        v = String.fromCharCode(Number.parseInt(c.slice(1), 10));
      }
    } else if (c in dict) {
      v = dict[c]!;
    }
    left += right.slice(0, res.index) + v;
    right = right.slice(res.index + substr.length);
  }
  return left + right;
};
