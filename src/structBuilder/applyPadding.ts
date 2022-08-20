import { Double } from "../types";
import { Rect } from "../math/Rect";

export const applyPadding = (
  src: Rect,
  pads: Double[],
  scale: Double
): Rect => {
  if (pads.length === 1) {
    return src.clone().grow(pads[0]! * scale);
  }
  if (pads.length === 2) {
    return src.clone().grow(pads[1]! * scale, pads[0]! * scale);
  }
  if (pads.length === 3) {
    const top = pads[0]! * scale;
    const dx = pads[1]! * scale;
    const bot = pads[2]! * scale;
    return new Rect(
      src.left - dx,
      src.top - top,
      src.right + dx,
      src.bottom + bot
    );
  }
  const t = pads[0]! * scale;
  const r = pads[1]! * scale;
  const b = pads[2]! * scale;
  const l = pads[3]! * scale;
  return new Rect(src.left - l, src.top - t, src.right + r, src.bottom + b);
};
