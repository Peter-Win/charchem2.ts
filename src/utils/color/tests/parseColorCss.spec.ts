import { Color, ColorRgb } from "../Color";
import { parseColorCss } from "../parseColorCss";

test("parseColorCss", () => {
  expect(parseColorCss("black")).toEqual({
    type: "name",
    name: "black",
  } satisfies Color);

  expect(parseColorCss("#F80")).toEqual({
    type: "hex",
    value: "#F80",
  } satisfies Color);

  expect(parseColorCss("rgb(255, 0, 127)")).toEqual({
    type: "rgb",
    r: 255,
    g: 0,
    b: 127,
    a: undefined,
  } satisfies ColorRgb);

  expect(parseColorCss("rgba(255, 0, 127, .5)")).toEqual({
    type: "rgb",
    r: 255,
    g: 0,
    b: 127,
    a: 127.5,
  } satisfies ColorRgb);

  expect(parseColorCss("F80")).toBe(undefined);

  expect(parseColorCss("")).toBe(undefined);
});
