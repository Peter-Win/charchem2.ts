import { createTestCompiler } from "../../ChemCompiler";
import { scanCharge } from "../scanCharge";

describe("scanCharge", () => {
  it("SuccessNum", () => {
    const c = createTestCompiler("O^2--");
    c.pos += 2;
    expect(c.curChar()).toBe("2");
    const charge = scanCharge(c, false);
    expect(charge).toBeDefined();
    expect(charge?.value).toBe(-2.0);
    expect(charge?.text).toBe("2-");
    expect(charge?.isLeft).toBe(false);
    expect(c.curChar()).toBe("-");
  });
  it("SuccessPlus1", () => {
    const c = createTestCompiler("O^+-");
    c.pos += 2;
    expect(c.curChar()).toBe("+");
    const charge = scanCharge(c, false);
    expect(charge).toBeDefined();
    expect(charge!.value).toBe(1.0);
    expect(charge!.text).toBe("+");
    expect(c.curChar()).toBe("-");
  });
  it("SuccessMinus1", () => {
    const c = createTestCompiler("O^-+");
    c.pos += 2;
    expect(c.curChar()).toBe("-");
    const charge = scanCharge(c, false);
    expect(charge).toBeDefined();
    expect(charge!.value).toBe(-1.0);
    expect(charge!.text).toBe("-");
    expect(c.curChar()).toBe("+");
  });
  it("SuccessMinus3", () => {
    const c = createTestCompiler("O^----");
    c.pos += 2;
    expect(c.curChar()).toBe("-");
    const charge = scanCharge(c, false);
    expect(charge).toBeDefined();
    expect(charge!.value).toBe(-3.0);
    expect(charge!.text).toBe("---");
    expect(c.curChar()).toBe("-");
  });
  it("NoCharge", () => {
    const c = createTestCompiler("O^--");
    expect(c.curChar()).toBe("O");
    const charge = scanCharge(c, false);
    expect(charge).toBeUndefined();
  });
  it("NoChargeLast", () => {
    const c = createTestCompiler("O^--");
    c.pos = 5;
    expect(c.isFinish()).toBe(true);
    const charge = scanCharge(c, false);
    expect(charge).toBeUndefined();
  });
});
