import { ColorRgb } from "../Color";
import { isColorRgb, isColorRgba, colorRgbParse } from "../colorRgb";

describe("colorRgb", () => {
  it("isColorRgb", () => {
    expect(isColorRgb("rgb(0,255,127)")).toBe(true);
    expect(isColorRgb("rgb(0, 255, 127)")).toBe(true);
    expect(isColorRgb("rgba(1,2,3,0.5)")).toBe(false);
  });
  it("isColorRgba", () => {
    expect(isColorRgba("rgba(255,127,0,0.5)")).toBe(true);
    expect(isColorRgba("rgba( 255 , 127 , 0 , 1 )")).toBe(true);
    expect(isColorRgba("rgba(255,127,0,.5)")).toBe(true);
    expect(isColorRgba("rgba(255,127,0,0)")).toBe(true);

    expect(isColorRgba("rgb(0,255,127)")).toBe(false);
    expect(isColorRgba("rgba(0,0,0,100)")).toBe(false);
  });
  it("colorRgbParse", () => {
    expect(colorRgbParse("rgb(0,255,127)")).toEqual({
      type: "rgb",
      r: 0,
      g: 255,
      b: 127,
      a: undefined,
    } satisfies ColorRgb);
    expect(colorRgbParse("rgba(255,127,0,0.5)")).toEqual({
      type: "rgb",
      r: 255,
      g: 127,
      b: 0,
      a: 127.5,
    } satisfies ColorRgb);
  });
});
