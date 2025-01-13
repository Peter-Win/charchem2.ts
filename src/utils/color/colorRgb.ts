import { ColorRgb } from "./Color";

export const isColorRgb = (value: string): boolean =>
  /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(value);

export const isColorRgba = (value: string): boolean =>
  /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(1|0|0?\.\d+)\s*\)$/i.test(
    value
  );

export const colorRgbParse = (value: string): ColorRgb | undefined => {
  const chunks = value.split(/[\(\),]/);
  let srcSamples: string[] = [];
  if (isColorRgb(value)) {
    srcSamples = chunks.slice(1, 4);
  } else if (isColorRgba(value)) {
    srcSamples = chunks.slice(1, 5);
  } else return undefined;
  const sampleValues: number[] = srcSamples.map((s) => +s);
  if (sampleValues.some((n) => Number.isNaN(n))) return undefined;
  const color: ColorRgb = {
    type: "rgb",
    r: sampleValues[0]!,
    g: sampleValues[1]!,
    b: sampleValues[2]!,
    a: sampleValues[3],
  };
  if (color.a) color.a *= 255;
  return color;
};
