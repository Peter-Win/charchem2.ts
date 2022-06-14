import { pathToString } from "../pathToString";
import { parsePath } from "../parsePath";

describe("pathToString", () => {
  it("Abs lines", () => {
    const path = "M0 0H10V10L8 2Z";
    expect(pathToString(parsePath(path))).toBe(path);
  });
  it("Rounding", () => {
    const path = "M1.0004 0.9996";
    expect(pathToString(parsePath(path))).toBe("M1 1");
  });
  it("Relative lines with comma", () => {
    const src = "M 0,10 h 10 v -10 l -5,5 z";
    const dst = "M0 10h10v-10l-5 5z";
    expect(pathToString(parsePath(src))).toBe(dst);
  });
  it("Bezier curves", () => {
    const src = "M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80";
    const dst = "M10 80C40 10 65 10 95 80S150 150 180 80";
    expect(pathToString(parsePath(src))).toBe(dst);
  });
  it("Cubic abs", () => {
    const src = "M 10 80 Q 52.5 10, 95 80 T 180 80";
    const dst = "M10 80Q52.5 10 95 80T180 80";
    expect(pathToString(parsePath(src))).toBe(dst);
  });
  it("Cubic relative", () => {
    const src = "M 10 80 q 42.5 -70, 85 0 t 85 0";
    const dst = "M10 80q42.5 -70 85 0t85 0";
    expect(pathToString(parsePath(src))).toBe(dst);
  });
  it("Arc", () => {
    const src = `M 10 315
    L 110 215
    A 30 50 0 0 1 162.55 162.45
    L 172.55 152.45
    A 30 50 -45 0 1 215.1 109.9
    L 315 10`;
    const dst =
      "M10 315L110 215A30 50 0 0 1 162.55 162.45L172.55 152.45A30 50 -45 0 1 215.1 109.9L315 10";
    expect(pathToString(parsePath(src))).toBe(dst);
  });
});
