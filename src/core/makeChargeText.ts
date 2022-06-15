import { Double } from "../types";
import { is0, toa } from "../math";

export const makeChargeText = (value: Double): string => {
  if (is0(value)) {
    return "";
  }
  const absCharge = Math.abs(value);
  let text = absCharge === 1.0 ? "" : toa(absCharge);
  text += value < 0 ? "-" : "+";
  return text;
};
