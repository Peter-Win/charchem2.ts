import { parsePath } from "../parsePath";

describe("parsePath", () => {
  it("linear", () => {
    expect(parsePath("M1, -2H3V-4L-5 6Z")).toEqual([
      { cmd: "M", rel: false, pt: { x: 1, y: -2 } },
      { cmd: "H", rel: false, x: 3 },
      { cmd: "V", rel: false, y: -4 },
      { cmd: "L", rel: false, pt: { x: -5, y: 6 } },
      { cmd: "Z", rel: false },
    ]);
    expect(parsePath("m1, -2h3v-4l-5 6z")).toEqual([
      { cmd: "M", rel: true, pt: { x: 1, y: -2 } },
      { cmd: "H", rel: true, x: 3 },
      { cmd: "V", rel: true, y: -4 },
      { cmd: "L", rel: true, pt: { x: -5, y: 6 } },
      { cmd: "Z", rel: true },
    ]);
  });
  it("Cubic curves", () => {
    expect(parsePath("Q10 20, 30 40 T 50 60")).toEqual([
      { cmd: "Q", rel: false, cp: { x: 10, y: 20 }, pt: { x: 30, y: 40 } },
      { cmd: "T", rel: false, pt: { x: 50, y: 60 } },
    ]);
  });
  it("Bezier curves", () => {
    expect(
      parsePath("M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80")
    ).toEqual([
      { cmd: "M", rel: false, pt: { x: 10, y: 80 } },
      {
        cmd: "C",
        rel: false,
        cp1: { x: 40, y: 10 },
        cp2: { x: 65, y: 10 },
        pt: { x: 95, y: 80 },
      },
      { cmd: "S", rel: false, cp2: { x: 150, y: 150 }, pt: { x: 180, y: 80 } },
    ]);
  });
  it("Arcs", () => {
    expect(
      parsePath(`M 10 315
    L 110 215
    A 30 50 0 0 1 162.55 162.45
    L 172.55 152.45
    A 30 50 -45 0 1 215.1 109.9
    L 315 10`)
    ).toEqual([
      { cmd: "M", rel: false, pt: { x: 10, y: 315 } },
      { cmd: "L", rel: false, pt: { x: 110, y: 215 } },
      {
        cmd: "A",
        rel: false,
        r: { x: 30, y: 50 },
        xRot: 0,
        largeArc: 0,
        sweep: 1,
        pt: { x: 162.55, y: 162.45 },
      },
      { cmd: "L", rel: false, pt: { x: 172.55, y: 152.45 } },
      {
        cmd: "A",
        rel: false,
        r: { x: 30, y: 50 },
        xRot: -45,
        largeArc: 0,
        sweep: 1,
        pt: { x: 215.1, y: 109.9 },
      },
      { cmd: "L", rel: false, pt: { x: 315, y: 10 } },
    ]);
  });
});
