import { ElementId } from "../../types/ElementId";

// BlueBookV2 P-14.1.2
// Table 1.3 Standard bonding numbers for the elements of Groups 13, 14, 15, 16, and 17

export const standardBondingNumber: Partial<Record<ElementId, number>> = {
  B: 3,
  Al: 3,
  Ga: 3,
  In: 3,
  Tl: 3,
  C: 4,
  Si: 4,
  Ge: 4,
  Sn: 4,
  Pb: 4,
  N: 3,
  P: 3,
  As: 3,
  Sb: 3,
  Bi: 3,
  O: 2,
  S: 2,
  Se: 2,
  Te: 2,
  Po: 2,
  F: 1,
  Cl: 1,
  Br: 1,
  I: 1,
  At: 1,
};
