import { ChemK } from "../ChemK";

describe("ChemK", () => {
  it("text", () => {
    const k = new ChemK("n");
    expect(k.isNumber()).toBe(false);
    expect(String(k)).toBe("n");
    expect(k.equals(new ChemK("n"))).toBe(true);
    expect(k.equals(new ChemK("N"))).toBe(false);
    expect(k.equals("n")).toBe(true);
    expect(k.equals("N")).toBe(false);
  });
  it("int", () => {
    const k = new ChemK(2);
    expect(k.isNumber()).toBe(true);
    expect(String(k)).toBe("2");
    expect(k.equals(new ChemK(2.0))).toBe(true);
    expect(k.equals(new ChemK(1))).toBe(false);
    expect(k.equals(2)).toBe(true);
    expect(k.equals(1)).toBe(false);
  });
  it("float", () => {
    const k = new ChemK(1.5);
    expect(k.isNumber()).toBe(true);
    expect(String(k)).toBe("1.5");
    expect(k.equals(new ChemK(1.5))).toBe(true);
    expect(k.equals(new ChemK(1.4))).toBe(false);
    expect(k.equals(1.5)).toBe(true);
    expect(k.equals(1.4)).toBe(false);
  });
  it("round", () => {
    expect(new ChemK(0.996).toString()).toBe("1");
    expect(new ChemK(0.9949).toString()).not.toBe("1");
    expect(new ChemK(1.004).toString()).toBe("1");
    expect(new ChemK(1.0051).toString()).not.toBe("1");
    expect(new ChemK(-0.996).toString()).toBe("-1");
    expect(new ChemK(-1.004).toString()).toBe("-1");
  });
});
