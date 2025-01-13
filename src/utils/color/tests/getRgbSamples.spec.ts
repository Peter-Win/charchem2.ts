import { ColorSamples } from "../ColorSamples";
import { getRgbSamples } from "../getRgbSamples";

describe("getRgbSamples", () => {
  it("by name", () => {
    expect(getRgbSamples({ type: "name", name: "white" })).toEqual({
      r: 255,
      g: 255,
      b: 255,
      a: undefined,
    } satisfies ColorSamples);
    expect(getRgbSamples({ type: "name", name: "wrong name" }) ?? null).toBe(
      null
    );
  });

  it("by hex", () => {
    expect(getRgbSamples({ type: "hex", value: "#F80" })).toEqual({
      r: 255,
      g: 0x88,
      b: 0,
      a: undefined,
    });
    expect(getRgbSamples({ type: "hex", value: "#12345678" })).toEqual({
      r: 0x12,
      g: 0x34,
      b: 0x56,
      a: 0x78,
    });
  });

  it("by rgb", () => {
    expect(getRgbSamples({ type: "rgb", r: 255, g: 0, b: 127 })).toEqual({
      r: 255,
      g: 0,
      b: 127,
      a: undefined,
    });
    expect(
      getRgbSamples({ type: "rgb", r: 0, g: 255, b: 199, a: 127 })
    ).toEqual({
      r: 0,
      g: 255,
      b: 199,
      a: 127,
    });
  });
});
