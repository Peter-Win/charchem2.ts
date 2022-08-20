import { Rect } from "../../math/Rect";
import { applyPadding } from "../applyPadding";

describe("applyPadding", () => {
  it("single value", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-50, -50, 150, 150);
    expect(String(applyPadding(src, [5], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
  it("two values: vert and horiz", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-10, -50, 110, 150);
    expect(String(applyPadding(src, [5, 1], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
  it("three values: top, horiz and bottom", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-20, -10, 120, 130);
    expect(String(applyPadding(src, [1, 2, 3], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
  it("four values: top, left, bottom, right", () => {
    const src = new Rect(0, 0, 100, 100);
    const dst = new Rect(-40, -10, 120, 130);
    expect(String(applyPadding(src, [1, 2, 3, 4], 10))).toBe(String(dst));
    expect(String(src)).toBe("{0, 0, 100, 100}");
  });
});
