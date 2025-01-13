import {
  isColorHex,
  colorHexIsShort,
  colorHexWithAlpha,
  colorHexSamples,
} from "../colorHex";

describe("colorHex", () => {
  test("isColorHex", () => {
    expect(isColorHex("#123")).toBe(true);
    expect(isColorHex("#ABF")).toBe(true);
    expect(isColorHex("#1239")).toBe(true);
    expect(isColorHex("#abcf")).toBe(true);
    expect(isColorHex("#E0E0E0")).toBe(true);
    expect(isColorHex("#FF00FF80")).toBe(true);
    expect(isColorHex("123")).toBe(true);
    expect(isColorHex("ABF")).toBe(true);
    expect(isColorHex("1239")).toBe(true);
    expect(isColorHex("abcf")).toBe(true);
    expect(isColorHex("E0E0E0")).toBe(true);
    expect(isColorHex("ff00ff80")).toBe(true);

    expect(isColorHex("")).toBe(false);
    expect(isColorHex("#")).toBe(false);
    expect(isColorHex("1")).toBe(false);
    expect(isColorHex("a")).toBe(false);
    expect(isColorHex("#1")).toBe(false);
    expect(isColorHex("#1A")).toBe(false);
    expect(isColorHex("#1AG")).toBe(false);
    expect(isColorHex("#12345")).toBe(false);
    expect(isColorHex("#1234567")).toBe(false);
    expect(isColorHex("#123456789")).toBe(false);

    expect(isColorHex("123", true)).toBe(false);
    expect(isColorHex("#123", false)).toBe(false);
  });

  test("colorHexIsShort", () => {
    expect(colorHexIsShort("#F80")).toBe(true);
    expect(colorHexIsShort("f80")).toBe(true);
    expect(colorHexIsShort("#FFF8")).toBe(true);
    expect(colorHexIsShort("fff8")).toBe(true);

    expect(colorHexIsShort("#123456")).toBe(false);
    expect(colorHexIsShort("#12345678")).toBe(false);
  });

  test("colorHexWithAlpha", () => {
    expect(colorHexWithAlpha("#123f")).toBe(true);
    expect(colorHexWithAlpha("123F")).toBe(true);
    expect(colorHexWithAlpha("#112233f0")).toBe(true);
    expect(colorHexWithAlpha("112233FE")).toBe(true);

    expect(colorHexWithAlpha("#123")).toBe(false);
    expect(colorHexWithAlpha("123")).toBe(false);
    expect(colorHexWithAlpha("#112233")).toBe(false);
    expect(colorHexWithAlpha("112233")).toBe(false);
  });

  test("colorHexSamples", () => {
    expect(colorHexSamples("123")).toEqual({
      r: 0x11,
      g: 0x22,
      b: 0x33,
      a: undefined,
    });
    expect(colorHexSamples("#F8a")).toEqual({
      r: 255,
      g: 0x88,
      b: 0xaa,
      a: undefined,
    });
    expect(colorHexSamples("f0f8")).toEqual({
      r: 255,
      g: 0,
      b: 255,
      a: 0x88,
    });
    expect(colorHexSamples("#0a0f")).toEqual({
      r: 0,
      g: 0xaa,
      b: 0,
      a: 255,
    });
    expect(colorHexSamples("123456")).toEqual({
      r: 0x12,
      g: 0x34,
      b: 0x56,
      a: undefined,
    });
    expect(colorHexSamples("#F080C0")).toEqual({
      r: 0xf0,
      g: 0x80,
      b: 0xc0,
      a: undefined,
    });
    expect(colorHexSamples("ff00ff80")).toEqual({
      r: 255,
      g: 0,
      b: 255,
      a: 0x80,
    });
    expect(colorHexSamples("#FF00FF80")).toEqual({
      r: 255,
      g: 0,
      b: 255,
      a: 0x80,
    });

    expect(colorHexSamples("")).toBe(undefined);
    expect(colorHexSamples("#")).toBe(undefined);
    expect(colorHexSamples("1")).toBe(undefined);
    expect(colorHexSamples("#hhh")).toBe(undefined);
  });
});
