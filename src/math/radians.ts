import { Double } from "../types";

export const rad2deg = (angleInRadians: Double) =>
  (angleInRadians * 180.0) / Math.PI;

export const deg2rad = (angleInDegrees: Double) =>
  (angleInDegrees * Math.PI) / 180.0;
