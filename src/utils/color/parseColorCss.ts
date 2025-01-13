import { Color } from "./Color";
import { isColorHex } from "./colorHex";
import { findColorByName } from "./colorNamesMap";
import { colorRgbParse } from "./colorRgb";

export const parseColorCss = (value: string | undefined): Color | undefined => {
  if (!value) return undefined;
  if (findColorByName(value))
    return {
      type: "name",
      name: value,
    };
  if (isColorHex(value, true))
    return {
      type: "hex",
      value,
    };
  return colorRgbParse(value);
};
