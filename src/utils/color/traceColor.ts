import { Color, ColorHex, ColorName, ColorRgb } from "./Color";

export interface ColorVisitor<Result = void> {
  name(c: ColorName): Result;
  hex(c: ColorHex): Result;
  rgb(c: ColorRgb): Result;
}

export const traceColor = <Result = void>(
  color: Color,
  visitor: ColorVisitor<Result>
): Result => {
  switch (color.type) {
    case "name":
      return visitor.name(color);
    case "hex":
      return visitor.hex(color);
    case "rgb":
      return visitor.rgb(color);
    default:
      break;
  }
  throw Error(`Invalid color = ${JSON.stringify(color)}`);
};
