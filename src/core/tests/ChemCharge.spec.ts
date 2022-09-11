import { createCharge } from "../ChemCharge";

const stdCh = { pos: "RT", isRound: false };

describe("createCharge", () => {
  it("plus", () => {
    const one = createCharge("+");
    expect(one).not.toBeNull();
    expect(one).toHaveProperty("text", "+");
    expect(one).toHaveProperty("value", 1.0);
    expect(one).toHaveProperty("isRound", false);
    const two = createCharge("++");
    expect(two).not.toBeNull();
    expect(two?.text).toBe("++");
    expect(two?.value).toBe(2.0);
    expect(two?.isRound).toBe(false);
    const three = createCharge("+++");
    expect(three).toEqual({
      text: "+++",
      value: 3.0,
      ...stdCh,
    });
    const four = createCharge("++++");
    expect(four).toBeUndefined();
  });

  it("minus", () => {
    const one = createCharge("-");
    expect(one).not.toBeNull();
    expect(one).toHaveProperty("text", "-");
    expect(one).toHaveProperty("value", -1.0);
    expect(one).toHaveProperty("isRound", false);

    const two = createCharge("--");
    expect(two).not.toBeNull();
    expect(two?.text).toBe("--");
    expect(two?.value).toBe(-2.0);
    expect(two?.isRound).toBe(false);

    const three = createCharge("---");
    expect(three).toEqual({
      text: "---",
      value: -3.0,
      ...stdCh,
    });
    const four = createCharge("----");
    expect(four).toBeUndefined();
  });

  it("left signed", () => {
    expect(createCharge("+6")).toEqual({
      text: "+6",
      value: 6.0,
      ...stdCh,
    });
    expect(createCharge("-2")).toEqual({
      text: "-2",
      value: -2.0,
      ...stdCh,
    });
    expect(createCharge("+12")).toEqual({
      text: "+12",
      value: 12.0,
      ...stdCh,
    });
  });

  it("right signed", () => {
    expect(createCharge("6+")).toEqual({
      ...stdCh,
      text: "6+",
      value: 6.0,
    });
    expect(createCharge("2-")).toEqual({
      ...stdCh,
      text: "2-",
      value: -2.0,
    });
    expect(createCharge("12+")).toEqual({
      ...stdCh,
      text: "12+",
      value: 12.0,
    });
    expect(createCharge("2--")).toBeUndefined();
  });

  it("round", () => {
    expect(createCharge("+o")).toEqual({
      ...stdCh,
      text: "+",
      value: 1.0,
      isRound: true,
    });
    expect(createCharge("-o")).toEqual({
      ...stdCh,
      text: "-",
      value: -1.0,
      isRound: true,
    });
  });
  it("roman", () => {
    expect(createCharge("i")).toEqual({
      ...stdCh,
      text: "I",
      value: 1.0,
    });
    expect(createCharge("v")).toEqual({
      ...stdCh,
      text: "V",
      value: 5,
    });
    expect(createCharge("x")).toBeUndefined();
  });
});
