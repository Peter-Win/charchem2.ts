export const normalize360 = (degAngle: number): number => {
  const m = degAngle % 360;
  return m < 0 ? 360 + m : m;
};
