export type ColorName = {
  type: "name";
  name: string;
};

export type ColorHex = {
  type: "hex";
  value: string; // see colorHex.ts
};

export type ColorRgb = {
  type: "rgb";
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type Color = ColorName | ColorHex | ColorRgb;
