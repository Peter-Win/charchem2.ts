import { FontWeight } from "../FontTypes";
// see https://www.w3.org/TR/2008/REC-CSS2-20080411/fonts.html#propdef-font-weight
// except bolder and lighter

export const fontWeightValue = (weight: FontWeight): number => {
  const value = +weight;
  if (!Number.isNaN(value)) return value;
  if (weight === "bold") return 700;
  return 400;
};

export const isBold = (weight?: FontWeight): boolean =>
  !!weight && fontWeightValue(weight) >= 700;
