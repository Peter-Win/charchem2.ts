import { Matrix2x3 } from "../Matrix2x3";
import { Point } from "../Point";

describe("Matrix2x3", () => {
  it("get/set", () => {
    const m = new Matrix2x3([0, 0, 0, 0, 0, 0]);
    expect(m.toString()).toBe("0 0 0 0 0 0");
    m.a = 1;
    m.b = 2;
    m.c = 3;
    m.d = 4;
    m.e = 5;
    m.f = 6;
    expect(m.toString()).toBe("1 2 3 4 5 6");
    expect(m.a).toBe(1);
    expect(m.b).toBe(2);
    expect(m.c).toBe(3);
    expect(m.d).toBe(4);
    expect(m.e).toBe(5);
    expect(m.f).toBe(6);
  });
  it("clone", () => {
    const m0 = Matrix2x3.createZero();
    const m1 = m0.clone();
    m1.a = 1;
    m1.d = 1;
    expect(m0.toString()).toBe("0 0 0 0 0 0");
    expect(m1.toString()).toBe("1 0 0 1 0 0");
  });
  it("translate", () => {
    const m = Matrix2x3.createIdentity();
    m.translate(new Point(11, -22));
    expect(m.toString()).toBe("1 0 0 1 11 -22");
    m.moveX(-11);
    expect(m.toString()).toBe("1 0 0 1 0 -22");
    m.moveY(22);
    expect(m.toString()).toBe("1 0 0 1 0 0");
  });
  it("scale", () => {
    const m = Matrix2x3.createIdentity();
    m.scale(5);
    expect(String(m)).toBe("5 0 0 5 0 0");
    m.scale(3, 1);
    expect(String(m)).toBe("15 0 0 5 0 0");
    m.scale(1, 4);
    expect(String(m)).toBe("15 0 0 20 0 0");
    m.scaleX(1 / 15);
    m.scaleY(1 / 20);
    expect(String(m)).toBe("1 0 0 1 0 0");
  });
  it("apply point", () => {
    const mt = Matrix2x3.createIdentity();
    mt.translate(3, 4);
    expect(String(mt.apply(new Point(0, 0)))).toBe("(3, 4)");
    expect(String(mt.apply(new Point(1, 2)))).toBe("(4, 6)");

    const ms = Matrix2x3.createIdentity();
    ms.scale(2, 4);
    expect(String(ms.apply(new Point(0, 0)))).toBe("(0, 0)");
    expect(String(ms.apply(new Point(1, 1)))).toBe("(2, 4)");
    expect(String(ms.apply(new Point(0, 10)))).toBe("(0, 40)");
    expect(String(ms.apply(new Point(10, 0)))).toBe("(20, 0)");
  });
  it("rotate", () => {
    const m = new Matrix2x3([1, 0, 0, 1, 0, 0]);
    m.rotateDeg(90);
    // expect(String(m)).toBe('');
    expect(String(m.apply(new Point(2, 0)))).toBe("(0, 2)");
    expect(String(m.apply(new Point(0, 3)))).toBe("(-3, 0)");
    expect(String(m.apply(new Point(-4, 0)))).toBe("(0, -4)");
  });
});
