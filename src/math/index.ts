import { Double } from "../types";

export const is0 = (value: Double) => Math.abs(value) < 0.001;

export const isClose = (a: Double, b: Double) => is0(Math.abs(a) - Math.abs(b));

export const toa = (value: Double): string =>
  value.toFixed(2).replace(/0+$/g, "").replace(/\.$/, "").replace(/^-0$/, "0");
