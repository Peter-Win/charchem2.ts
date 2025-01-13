import { parsePath } from "../../utils/parsePath";
import { path2ps } from "../path2ps";

describe("path2ps", () => {
  it("line absolute", () => {
    const path = parsePath("M 10 0 L 50 30 M 60 0 L 10 30");
    expect(path2ps(path)).toEqual([
      "10 0 moveto",
      "50 30 lineto",
      "60 0 moveto",
      "10 30 lineto",
    ]);
  });

  it("vertical and horizontal absolute lines", () => {
    const path = parsePath("M 10 10 H 400 V 300 H 10 V 20");
    expect(path2ps(path)).toEqual([
      "10 10 moveto",
      "400 10 lineto",
      "400 300 lineto",
      "10 300 lineto",
      "10 20 lineto",
    ]);
  });

  it("relative lines", () => {
    const path = parsePath("M 1,1 h9 v5 l-9,-5 m0 5 l9 -5");
    expect(path2ps(path)).toEqual([
      "1 1 moveto",
      "10 1 lineto",
      "10 6 lineto",
      "1 1 lineto",
      "1 6 moveto",
      "10 1 lineto",
    ]);
  });
  it("close path", () => {
    const path = parsePath("M 10 0 L 50 30 M 60 0z");
    expect(path2ps(path)).toEqual([
      "10 0 moveto",
      "50 30 lineto",
      "60 0 moveto",
      "closepath",
    ]);
  });
  it("cubic bezier", () => {
    // _(x2)_m(y3,x-.5)_m(x-2)_(y-3,x.5)
    const path = parsePath("M0 0L46.67 0C35 70 -11.67 70 0 0");
    expect(path2ps(path)).toEqual([
      "0 0 moveto",
      "46.67 0 lineto",
      "35 70 -11.67 70 0 0 curveto",
    ]);
  });
  it("Quadratic bezier", () => {
    // _(x2)_m(y3,x-2.5)_(y-3,x.5)
    const path = parsePath("M0 0L46.67 0Q-11.67 70 0 0");
    // https://www3.nd.edu/~gconant/bezier/
    // p1 46.67, 0        Q1 46.67, 0
    // p2 -11.67, 70  --> Q2 7.78, 46.67
    // p3 0, 0            Q3 -7.78, 46.67
    //                    Q4 0, 0
    const lines = path2ps(path);
    // For testing purposes, it is necessary to round the obtained values in line #2 to 2 digits after the point.
    lines[2] = lines[2]!
      .split(" ")
      .map((s) => {
        const n = +s;
        return Number.isNaN(n) ? s : String(Math.round(n * 100) / 100);
      })
      .join(" ");
    expect(lines).toEqual([
      "0 0 moveto",
      "46.67 0 lineto",
      "7.78 46.67 -7.78 46.67 0 0 curveto",
    ]);
  });
});
