const dict: Record<string, string> = {
  "'": "apos",
  '"': "quot",
  "&": "amp",
  "<": "lt",
  ">": "gt",
};

export const escapeXml = (
  value: string,
  nonAscii?: (code: number) => string
): string =>
  Array.from(value)
    .map((char) => {
      if (char in dict) {
        return `&${dict[char]};`;
      }
      if (!nonAscii || (char >= " " && char <= "~")) {
        return char;
      }
      const esc = nonAscii(char.charCodeAt(0));
      return esc ? `&#${esc};` : char;
    })
    .join("");

export const hexLow = (code: number) => `x${code.toString(16)}`;

export const dec = (code: number) => String(code);
