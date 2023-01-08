import { calcAbsMCD, Rational } from "../Rational";

describe("Rational", () => {
  it("toString", () => {
    expect(new Rational().toString()).toBe("0");
    expect(String(new Rational(10))).toBe("10");
    expect(String(new Rational(1, 2))).toBe("1/2");
  });

  it("copy", () => {
    const a = new Rational(3, 4);
    const b = a.copy();
    a.set(1);
    expect(b.x).toBe(3);
    expect(b.y).toBe(4);
    expect(b.x).not.toBe(a.x);
    expect(b.y).not.toBe(a.y);
  });

  it("set", () => {
    const a = new Rational();
    a.set(21);
    expect(a.x).toBe(21);
    expect(a.y).toBe(1);
  });

  it("isZero", () => {
    expect(new Rational().isZero()).toBe(true);
    expect(new Rational(0, 1).isZero()).toBe(true);
    expect(new Rational(0, 10).isZero()).toBe(true);
    expect(new Rational(1).isZero()).toBe(false);
  });

  it("absLess", () => {
    // abs(1) < abs (2) = true
    expect(new Rational(1).absLess(new Rational(2))).toBe(true);
    // abs(1/3) < abs(1/2) = true
    expect(new Rational(1, 3).absLess(new Rational(1, 2))).toBe(true);
    // abs(-2) < abs(1) = false
    expect(new Rational(-2).absLess(new Rational(1))).toBe(false);
    // abs(1) < abs(1) = false
    expect(new Rational(1).absLess(new Rational(1))).toBe(false);
  });

  it("sign", () => {
    expect(new Rational().sign()).toBe(0);
    expect(new Rational(3, 4).sign()).toBe(1);
    expect(new Rational(-1, 2).sign()).toBe(-1);
  });

  it("negx", () => {
    const p = new Rational(3, 4);
    const n = p.negx();
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
    expect(n.x).toBe(-3);
    expect(n.y).toBe(4);
  });

  it("absx", () => {
    const p = new Rational(3, 4);
    const n = new Rational(-3, 4);
    const ap = p.absx();
    const an = n.absx();
    expect(p).toEqual({ x: 3, y: 4 });
    expect(n).toEqual({ x: -3, y: 4 });
    expect(ap).toEqual({ x: 3, y: 4 });
    expect(an).toEqual({ x: 3, y: 4 });
  });

  it("norm", () => {
    const h = new Rational(1, -2);
    h.norm();
    expect(h).toEqual({ x: -1, y: 2 });
    const z = new Rational(0, 10).norm();
    expect(z).toEqual({ x: 0, y: 1 });
    expect(new Rational(2, 4).norm()).toEqual({ x: 1, y: 2 });
    expect(new Rational(-9, 3).norm()).toEqual({ x: -3, y: 1 });
    expect(new Rational(2, 2).norm()).toEqual({ x: 1, y: 1 });
  });

  it("addi", () => {
    // 1/2 + 1/2 = 1
    const a = new Rational(1, 2);
    a.addi(new Rational(1, 2));
    expect(a).toEqual({ x: 1, y: 1 });
    a.addi(2);
    expect(a).toEqual({ x: 3, y: 1 }); // 1+2 =3

    // 1/2 + -1/2 = 0
    const z = new Rational(1, 2);
    z.addi(new Rational(-1, 2));
    expect(z).toEqual({ x: 0, y: 1 });

    // -1/4 + 1 = 3/4
    const b = new Rational(-1, 4);
    b.addi(1);
    expect(b).toEqual({ x: 3, y: 4 });

    // 1/2 + 1/3 = 3/6 + 2/6 = 5/6
    const c = new Rational(1, 2).addi(new Rational(1, 3));
    expect(c).toEqual({ x: 5, y: 6 });
  });

  it("addx", () => {
    const h = new Rational(1, 2);
    expect(h.addx(1)).toEqual({ x: 3, y: 2 }); // 1/2 + 1 = 3/2
    expect(h).toEqual({ x: 1, y: 2 }); // source value dont changed
    expect(h.addx(h)).toEqual({ x: 1, y: 1 }); // 1/2 + 1/2 = 1
    expect(h.addx(h.negx())).toEqual({ x: 0, y: 1 }); // 1/2 + -1/2 = 0
    expect(h.addx(new Rational(1, 3))).toEqual({ x: 5, y: 6 }); // 1/2 + 1/3 = 5/6
  });

  it("subi", () => {
    const a = new Rational(9, 10);
    a.subi(new Rational(2, 10));
    expect(a).toEqual({ x: 7, y: 10 }); // 9/10 - 2/10 = 7/10
    a.subi(new Rational(1, 10));
    expect(a).toEqual({ x: 3, y: 5 }); // 7/10 - 1/10 = 6/10 = 3/5
  });

  it("subx", () => {
    const h = new Rational(1, 2);
    expect(h.subx(new Rational(1))).toEqual({ x: -1, y: 2 }); // 1/2 - 1 = -1/2
    expect(h).toEqual({ x: 1, y: 2 }); // source value dont changed
    expect(h.subx(h)).toEqual({ x: 0, y: 1 }); // 1/2 - 1/2 = 0
    expect(h.subx(h.negx())).toEqual({ x: 1, y: 1 }); // 1/2 - -1/2 = 1
    expect(h.subx(new Rational(1, 3))).toEqual({ x: 1, y: 6 }); // 1/2 - 1/3 = 3/6 - 2/6 = 1/6
  });

  it("mulx", () => {
    const r34 = new Rational(3, 4);
    expect(r34.mulx(r34)).toEqual({ x: 9, y: 16 }); // 3/4 * 3/4 = 9/16
    expect(r34).toEqual({ x: 3, y: 4 }); // source valued dont changed
    expect(r34.mulx(new Rational(4))).toEqual({ x: 3, y: 1 }); // 3/4 * 4 = 3
    expect(r34.mulx(new Rational(1, 2))).toEqual({ x: 3, y: 8 }); // 3/4 * 1/2 = 3/8
    expect(r34.mulx(1)).toEqual(r34); // 3/4 * 1 = 3/4
    expect(r34.mulx(10)).toEqual({ x: 15, y: 2 }); // 3/4 * 10 = 30/4 = 15/2
    expect(r34.mulx(-1)).toEqual({ x: -3, y: 4 }); // 3/4 * -1 = -3/4
  });

  it("muli", () => {
    const a = new Rational(3, 4);
    a.muli(a);
    expect(a).toEqual({ x: 9, y: 16 }); // 3/4 * 3/4 = 9/16
    const b = new Rational(1, 2);
    expect(b.muli(5)).toEqual({ x: 5, y: 2 }); // 1/2 * 5 = 5/2
    expect(b).toEqual({ x: 5, y: 2 });
  });

  it("divx", () => {
    const r34 = new Rational(3, 4);
    expect(r34.divx(r34)).toEqual({ x: 1, y: 1 }); // 3/4 / 3/4 = 1
    expect(r34).toEqual({ x: 3, y: 4 }); // source valued dont changed
    expect(r34.divx(new Rational(4))).toEqual({ x: 3, y: 16 }); // 3/4 / 4 = 3/16
    expect(r34.divx(new Rational(1, 2))).toEqual({ x: 3, y: 2 }); // 3/4 / 1/2 = (3*2)/(4*1) = 6/4 = 3/2
    expect(new Rational(5, 6).divx(new Rational(6, 7))).toEqual({
      x: 35,
      y: 36,
    }); // 5/6 / 6/7 = 5/6 * 7/6 = 35/36
    expect(r34.divx(new Rational(-1))).toEqual({ x: -3, y: 4 }); // 3/4 / -1 = -3/4
    expect(new Rational(-3, 4).divx(new Rational(-1))).toEqual(r34); // -3/4 / -1 = 3/4
  });

  it("divi", () => {
    const a = new Rational(3, 4);
    a.divi(a);
    expect(a).toEqual({ x: 1, y: 1 }); // 3/4 / 3/4 = 1
    const b = new Rational(1, 2);
    expect(b.divi(new Rational(5))).toEqual({ x: 1, y: 10 }); // 1/2 / 5 = 1/10
    expect(b).toEqual({ x: 1, y: 10 });
  });
});

it("calcAbsMCD", () => {
  expect(calcAbsMCD(1, 1)).toBe(1);
  expect(calcAbsMCD(2, 4)).toBe(2);
  expect(calcAbsMCD(6, 8)).toBe(2);
  expect(calcAbsMCD(6, 9)).toBe(3);
  expect(calcAbsMCD(12, 24)).toBe(12);
  expect(calcAbsMCD(-6, 9)).toBe(3);
  expect(calcAbsMCD(6, -9)).toBe(3);
  expect(calcAbsMCD(-6, -9)).toBe(3);
});
