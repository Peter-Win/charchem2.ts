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
  it("updatePoint", () => {
    const rc = new Rect();
    expect(rc.toString()).toBe("{0, 0, 0, 0}");
    rc.updatePoint(new Point(1, 0));
    expect(rc.toString()).toBe("{0, 0, 1, 0}");
    rc.updatePoint(new Point(0, 1));
    expect(rc.toString()).toBe("{0, 0, 1, 1}");
    rc.updatePoint(new Point(0.5, 0.5));
    expect(rc.toString()).toBe("{0, 0, 1, 1}");
    rc.updatePoint(new Point(-1, -2));
    expect(rc.toString()).toBe("{-1, -2, 1, 1}");
    rc.updatePoint(new Point(3, 4));
    expect(rc.toString()).toBe("{-1, -2, 3, 4}");
  });

  it("unite", () => {
    const rc1 = new Rect(0, 0, 10, 20);
    // enlarge right bottom
    rc1.unite(new Rect(10, 10, 20, 30));
    expect(rc1.toString()).toBe("{0, 0, 20, 30}");
    // change left only
    rc1.unite(new Rect(-10, 0, 10, 10));
    expect(rc1.toString()).toBe("{-10, 0, 20, 30}");
    // change top only
    rc1.unite(new Rect(0, -1, 1, 1));
    expect(rc1.toString()).toBe("{-10, -1, 20, 30}");
    rc1.unite(new Rect(10, 10, 20, 20));
    // not changed
    expect(rc1.toString()).toBe("{-10, -1, 20, 30}");
  });

  it("move", () => {
    const rc = new Rect(10, 20, 30, 40);
    rc.move(new Point(1, -10));
    expect(rc.toString()).toBe("{11, 10, 31, 30}");
  });
  it("contains", () => {
    expect(new Rect().contains(new Point())).toBe(true);
    // center
    expect(new Rect(0, 0, 10, 10).contains(new Point(5, 5))).toBe(true);
    // bottom
    expect(new Rect(0, 0, 10, 10).contains(new Point(5, 10))).toBe(true);
    expect(new Rect(0, 0, 10, 10).contains(new Point(5, 10.1))).toBe(false);
    // top
    expect(new Rect(0, 0, 10, 10).contains(new Point(5, 0))).toBe(true);
    expect(new Rect(0, 0, 10, 10).contains(new Point(5, -0.1))).toBe(false);
    // left
    expect(new Rect(0, 0, 10, 10).contains(new Point(0, 5))).toBe(true);
    expect(new Rect(0, 0, 10, 10).contains(new Point(-0.1, 5))).toBe(false);
    // right
    expect(new Rect(0, 0, 10, 10).contains(new Point(10, 5))).toBe(true);
    expect(new Rect(0, 0, 10, 10).contains(new Point(10.1, 5))).toBe(false);
  });

  it("grow", () => {
    const r = new Rect(0, 1, 20, 10);
    expect(String(r)).toBe("{0, 1, 20, 10}");
    r.grow(2);
    expect(String(r)).toBe("{-2, -1, 22, 12}");
    r.grow(-1, 0);
    expect(String(r)).toBe("{-1, -1, 21, 12}");
    r.grow(0, -1);
    expect(String(r)).toBe("{-1, 0, 21, 11}");
  });
});
