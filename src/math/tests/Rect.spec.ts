import { Point } from "../Point";
import { Rect } from "../Rect";

describe("Rect", () => {
  it("constructor", () => {
    expect(String(new Rect())).toBe("{0, 0, 0, 0}");
    expect(String(new Rect(0, 1, 2, 3))).toBe("{0, 1, 2, 3}");
    const a = new Point(-1, -2);
    const b = new Point(10, 20);
    const r = new Rect(a, b);
    a.add(1, 1); // point can be chenged, but rect is not changed
    b.add(2, 2);
    expect(String(r)).toBe("{-1, -2, 10, 20}");
  });
  it("clone", () => {
    const src = new Rect(10, 11, 100, 101);
    const dst = src.clone();
    // change src
    src.A.x = 0;
    src.B.x = 0;
    expect(String(src)).toBe("{0, 11, 0, 101}");
    expect(String(dst)).toBe("{10, 11, 100, 101}"); // dst not changed
  });
});
