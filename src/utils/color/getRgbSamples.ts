import { Color } from "./Color";
import { colorHexSamples } from "./colorHex";
import { findColorByName } from "./colorNamesMap";
import { ColorSamples } from "./ColorSamples";
import { traceColor } from "./traceColor";

export const getRgbSamples = (color: Color): ColorSamples | undefined =>
  traceColor(color, {
    name: (c) => colorHexSamples(findColorByName(c.name)),
    hex: (c) => colorHexSamples(c.value),
    rgb: ({ r, g, b, a }) => ({ r, g, b, a }),
  });
