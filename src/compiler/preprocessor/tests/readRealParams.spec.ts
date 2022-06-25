import { readRealParams } from "../execMacros";
import { PreProcCtx } from "../PreProcCtx";

describe("ReadRealParams", () => {
  it("Empty", () => {
    expect(readRealParams(new PreProcCtx("A()", 2))).toEqual([]);
  });
  it("Single", () => {
    expect(readRealParams(new PreProcCtx("A(abc)", 2))).toEqual(["abc"]);
  });
  it("WithSkip", () => {
    expect(readRealParams(new PreProcCtx("A(x,,z)", 2))).toEqual([
      "x",
      "",
      "z",
    ]);
  });
  it("Nested", () => {
    expect(
      readRealParams(new PreProcCtx('A(rgb(255,0,0),"hello, world!")', 2))
    ).toEqual(["rgb(255,0,0)", '"hello, world!"']);
  });
});
