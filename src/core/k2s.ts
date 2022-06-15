import { Double } from "../types";
import { toa } from "../math";

export const k2s = (k: Double): string => (k === 1.0 ? "" : toa(k));
