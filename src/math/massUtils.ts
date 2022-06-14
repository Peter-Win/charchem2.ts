import { toa } from "./index";
import { Double } from "../types";

export const roundMass = (mass: Double): Double =>
  Math.round(mass * 100.0) / 100.0;

export const strMass = (mass: Double) => toa(roundMass(mass));
