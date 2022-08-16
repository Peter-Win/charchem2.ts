import { Point, pointFromDeg } from "../Point";

describe("pointFromDeg", () => {
  it("right angles", () => {
    expect(pointFromDeg(0).toString()).toBe("(1, 0)");
    expect(pointFromDeg(90).toString()).toBe("(0, 1)");
    expect(pointFromDeg(180).toString()).toBe("(-1, 0)");
    expect(pointFromDeg(270).toString()).toBe("(0, -1)");
    expect(pointFromDeg(-90).toString()).toBe("(0, -1)");
  });
  it("angles that are multiples of 30 degrees", () => {
    const long = Math.sqrt(3) / 2;
    const short = 0.5;
    expect(pointFromDeg(30).equals(new Point(long, short))).toBe(true);
    expect(pointFromDeg(60).equals(new Point(short, long))).toBe(true);
    expect(pointFromDeg(120).equals(new Point(-short, long))).toBe(true);
    expect(pointFromDeg(150).equals(new Point(-long, short))).toBe(true);
    expect(pointFromDeg(-30).equals(new Point(long, -short))).toBe(true);
  });
});

describe("Point", () => {
  it("toString", () => {
    const p1 = new Point(0.1, -0.2);
    expect(p1.toString()).toBe("(0.1, -0.2)");
    expect(String(p1)).toBe("(0.1, -0.2)");
    expect(`_${p1}_`).toBe("_(0.1, -0.2)_"); // implicit function call
  });
  it("equals", () => {
    const p1 = new Point(1.0, 1.0);
    // delta is less then 0.001
    expect(p1.equals(new Point(1.0009, 1.0009))).toBe(true);
    expect(p1.equals(new Point(0.9991, 0.9991))).toBe(true);
    // delta is greater then 0.001
    expect(p1.equals(new Point(1.0011, 1.0011))).toBe(false);
    expect(p1.equals(new Point(0.9989, 0.9989))).toBe(false);
  });
  it("isZero", () => {
    expect(new Point().isZero()).toBe(true);
    expect(new Point(0.0009, -0.0009).isZero()).toBe(true);
    expect(new Point(0.0011, 0.0011).isZero()).toBe(false);
  });
  it("plus", () => {
    const p1 = new Point(0.1, -0.2);
    const p2 = p1.plus(new Point(-0.3, 0.4));
    expect(p1.toString()).toBe("(0.1, -0.2)"); // must be not changed
    expect(p2.toString()).toBe("(-0.2, 0.2)"); // result summa
  });
  it("add", () => {
    const p = new Point();
    p.add(0.1, -0.2);
    expect(String(p)).toBe("(0.1, -0.2)");
  });
  it("minus", () => {
    const p1 = new Point(1, 1);
    const p2 = p1.minus(new Point(0.1, 0.2));
    expect(String(p1)).toBe("(1, 1)"); // must be not changed
    expect(String(p2)).toBe("(0.9, 0.8)");
  });
  it("times", () => {
    const p1 = new Point(1, 2);
    const p2 = p1.times(10);
    expect(String(p1)).toBe("(1, 2)"); // must be not changed
    expect(String(p2)).toBe("(10, 20)");
  });
  it("mini", () => {
    const p = new Point(0, 10);
    p.mini(new Point(5, 5));
    expect(String(p)).toBe("(0, 5)");
  });
  it("maxi", () => {
    const p = new Point(0, 10);
    p.maxi(new Point(5, 5));
    expect(String(p)).toBe("(5, 10)");
  });
  it("polarAngleDeg", () => {
    expect(new Point().polarAngleDeg()).toBe(0);
    expect(new Point(100, 0).polarAngleDeg()).toBeCloseTo(0, 3);
    expect(new Point(0, 123).polarAngleDeg()).toBeCloseTo(90, 3);
    expect(new Point(-22, 0.00001).polarAngleDeg()).toBeCloseTo(180, 3);
    expect(new Point(-22, -0.00001).polarAngleDeg()).toBeCloseTo(-180, 3);
    expect(new Point(0, -0.1).polarAngleDeg()).toBeCloseTo(-90, 3);
    expect(new Point(1, 1).polarAngleDeg()).toBeCloseTo(45, 3);
    expect(new Point(1, -1).polarAngleDeg()).toBeCloseTo(-45, 3);
    expect(new Point(-1, 1).polarAngleDeg()).toBeCloseTo(135, 3);
    expect(new Point(-1, -1).polarAngleDeg()).toBeCloseTo(-135, 3);
    expect(pointFromDeg(10).polarAngleDeg()).toBeCloseTo(10, 3);
  });
  it("length", () => {
    expect(new Point(0, 100).length()).toBeCloseTo(100, 1);
    expect(pointFromDeg(15).times(25).length()).toBeCloseTo(25, 1);
  });
  it("dist", () => {
    expect(new Point(1, 0).dist(new Point(10, 0))).toBeCloseTo(9);
  });
  it("normal", () => {
    expect(String(new Point().normal())).toBe(String(Point.zero));
    expect(String(new Point(0, 1).normal())).toBe(String(new Point(0, 1)));
    expect(String(new Point(0, 10).normal())).toBe(String(new Point(0, 1)));
    const q2 = Math.sqrt(2) / 2;
    expect(String(new Point(1, 1).normal())).toBe(String(new Point(q2, q2)));
  });
  it("transpon", () => {
    //       | # 1, -2
    // #-2,-1|
    // ------*------
    //       |    # 2,1
    //     # |
    //  -1,2
    let p = new Point(2, 1);
    p = p.transpon();
    expect(String(p)).toBe(String(new Point(-1, 2)));
    p = p.transpon();
    expect(String(p)).toBe(String(new Point(-2, -1)));
    p = p.transpon();
    expect(String(p)).toBe(String(new Point(1, -2)));
    p = p.transpon();
    expect(String(p)).toBe(String(new Point(2, 1)));
    p = p.transpon(true);
    expect(String(p)).toBe(String(new Point(1, -2)));
    p = p.transpon(true);
    expect(String(p)).toBe(String(new Point(-2, -1)));
    p = p.transpon(true);
    expect(String(p)).toBe(String(new Point(-1, 2)));
  });
});
