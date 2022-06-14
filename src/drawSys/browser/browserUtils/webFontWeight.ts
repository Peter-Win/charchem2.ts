import { FontWeight } from "../../FontTypes";
import { fontWeightValue } from "../../utils/fontWeightValue";

export const webFontWeight = (weight?: string): FontWeight => {
  if (!weight || weight === "all") {
    return "normal";
  }
  const first: string = weight.split(",")[0]!.trim();
  if (first === "normal" || first === "bold") {
    return first;
  }
  return String(fontWeightValue(first as FontWeight)) as FontWeight;
};
