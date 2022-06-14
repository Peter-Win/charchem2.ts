import { tracePath } from "../tracePath";
import { parsePath } from "../parsePath";
import { PathVisitor } from "../../path";
import { Point } from "../../../math/Point";

const makePoints = (d: string): string[] => {
  const segments = parsePath(d);
  const points: string[] = [];
  const visitor: PathVisitor = {
    onM(p) {
      points.push(String(p));
    },
    onL(p) {
      points.push(String(p));
    },
    onC(cp1: Point, cp2: Point, p: Point) {
      points.push(`${cp1}*`);
      points.push(`${cp2}*`);
      points.push(`${p}`);
    },
    onQ(cp: Point, pt: Point) {
      points.push(`${cp}*`);
      points.push(`${pt}`);
    },
    onA(r, xRot, largeArc, sweep, pt) {
      points.push(`${r}r`);
      points.push(`${xRot}deg`);
      points.push(`largeArc:${largeArc}`);
      points.push(`sweep:${sweep}`);
      points.push(String(pt));
    },
  };
  tracePath(segments, visitor);
  return points;
};

describe("tracePath", () => {
  it("Line abs", () => {
    expect(makePoints("M0 10 L 10 10 L 10 0z")).toEqual([
      "(0, 10)",
      "(10, 10)",
      "(10, 0)",
      "(0, 10)",
    ]);
  });
  it("Line relative", () => {
    expect(makePoints("M1,1 l5 5l-5 5z")).toEqual([
      "(1, 1)",
      "(6, 6)",
      "(1, 11)",
      "(1, 1)",
    ]);
  });
  it("Horiz and vert abs", () => {
    expect(makePoints("M10 10H20V20Z")).toEqual([
      "(10, 10)",
      "(20, 10)",
      "(20, 20)",
      "(10, 10)",
    ]);
  });
  it("Horiz and vert relative", () => {
    expect(makePoints("M10 10h10v10h-10z")).toEqual([
      "(10, 10)",
      "(20, 10)",
      "(20, 20)",
      "(10, 20)",
      "(10, 10)",
    ]);
  });
  it("Bezier abs", () => {
    expect(makePoints("M 70 10 C 70 20, 110 20, 110 10")).toEqual([
      "(70, 10)",
      "(70, 20)*",
      "(110, 20)*",
      "(110, 10)",
    ]);
  });
  it("Short Bezier abs", () => {
    expect(
      makePoints("M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80")
    ).toEqual([
      "(10, 80)",
      "(40, 10)*",
      "(65, 10)*",
      "(95, 80)",
      "(125, 150)*",
      "(150, 150)*",
      "(180, 80)",
    ]);
  });
  it("Cubic abs", () => {
    expect(makePoints("M 10 80 Q 52.5 10, 95 80 T 180 80")).toEqual([
      "(10, 80)",
      "(52.5, 10)*",
      "(95, 80)",
      "(137.5, 150)*",
      "(180, 80)",
    ]);
  });
  it("Cubic relative", () => {
    expect(makePoints("M 10 80 q 42.5 -70, 85 0 t 85 0")).toEqual([
      "(10, 80)",
      "(52.5, 10)*",
      "(95, 80)",
      "(137.5, 150)*",
      "(180, 80)",
    ]);
  });
  it("Arc abs", () => {
    expect(
      makePoints(`M 10 315
    L 110 215
    A 30 50 0 0 1 162.55 162.45
    L 172.55 152.45
    A 30 50 -45 0 1 215.1 109.9
    L 315 10`)
    ).toEqual([
      "(10, 315)",
      "(110, 215)",
      "(30, 50)r",
      "0deg",
      "largeArc:0",
      "sweep:1",
      "(162.55, 162.45)",
      "(172.55, 152.45)",
      "(30, 50)r",
      "-45deg",
      "largeArc:0",
      "sweep:1",
      "(215.1, 109.9)",
      "(315, 10)",
    ]);
  });
});
