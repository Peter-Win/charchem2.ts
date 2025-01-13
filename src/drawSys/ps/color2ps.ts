import { Color } from "../../utils/color/Color";
import { getRgbSamples } from "../../utils/color/getRgbSamples";
import { parseColorCss } from "../../utils/color/parseColorCss";

const n255 = 1 / 255;

const scaleSample = (value: number) => +(value * n255).toFixed(3);

export const color2ps = (color: Color | undefined): string => {
  if (!color) return "";
  const samples = getRgbSamples(color);
  if (!samples) return "";
  const r = scaleSample(samples.r);
  const g = scaleSample(samples.g);
  const b = scaleSample(samples.b);
  return `${r} ${g} ${b} setrgbcolor`;
};

export const cssColor2ps = (cssColor: string | undefined): string =>
  color2ps(parseColorCss(cssColor));
