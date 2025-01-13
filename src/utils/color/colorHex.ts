import { ColorSamples } from "./ColorSamples";

export const withoutSharp = (value: string): string =>
  value[0] === "#" ? value.slice(1) : value;

export const isColorHex = (value: string, sharp?: boolean): boolean => {
  if (sharp === true && value[0] !== "#") return false;
  if (sharp === false && value[0] === "#") return false;
  return /^#?([\dA-F]{3,4}|[\dA-F]{6}|[\dA-F]{8})$/i.test(value);
};

export const colorHexIsShort = (value: string): boolean => {
  const { length } = withoutSharp(value);
  return length === 3 || length === 4;
};

export const colorHexWithAlpha = (value: string): boolean => {
  const { length } = withoutSharp(value);
  return length === 4 || length === 8;
};

export const colorHexSamples = (
  value: string | undefined
): ColorSamples | undefined => {
  if (!value) return undefined;
  const pure = withoutSharp(value);
  let chunks: string[] | undefined;
  switch (pure.length) {
    case 3:
    case 4:
      chunks = pure.split("").map((c) => c + c);
      break;
    case 6:
      chunks = [0, 2, 4].map((n) => pure.slice(n, n + 2));
      break;
    case 8:
      chunks = [0, 2, 4, 6].map((n) => pure.slice(n, n + 2));
      break;
    default:
      break;
  }
  if (!chunks) return undefined;
  const samples: number[] = chunks.map((s) => parseInt(s, 16));
  if (samples.findIndex((n) => Number.isNaN(n)) >= 0) return undefined;
  return {
    r: samples[0]!,
    g: samples[1]!,
    b: samples[2]!,
    a: samples[3],
  };
};
