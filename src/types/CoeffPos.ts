//  LT CU RT
//     ##
//     ##
//  LB    RB
export type CoeffPos = "LT" | "RT" | "LB" | "RB" | "CU";

export const isLeftCoeff = (pos?: CoeffPos): boolean => pos?.[0] === "L";
