import { isClose } from "../../math";

export const getFontSizeFromPt = (
  fontSizePt: number | undefined,
): string | undefined => {
  if (!fontSizePt || isClose(fontSizePt, 10)) return undefined;
  return `${fontSizePt * 10}%`;
};
