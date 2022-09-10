//  LT CU RT
//     ##
//     ##

import { normalize360 } from "../math/angles";

//  LB    RB
export type CoeffPos = "LT" | "RT" | "LB" | "RB" | "CU";

export const rxCoeffPos = /^LT|RT|LB|RB|CU$/;

export type CoeffPosOrAngle = CoeffPos | number;

export const isLeftCoeff = (pos?: CoeffPos): boolean => pos?.[0] === "L";

export const isLeftCoeffA = (pos?: CoeffPosOrAngle): boolean => {
  if (typeof pos === "number") {
    const angle = normalize360(pos);
    return angle > 90 && angle < 270;
  }
  return isLeftCoeff(pos);
};
