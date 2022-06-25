import { createTestCompiler } from "../../ChemCompiler";
import { scanInt } from "../scanInt";

describe("scanInt", () => {
  it("NotNumber", () => {
    const compiler = createTestCompiler("H2O");
    expect(scanInt(compiler)).toBeUndefined();
    expect(compiler.pos).toBe(0);
  });
  it("UnsignedShortInt", () => {
    const compiler = createTestCompiler("2H2O");
    const k = scanInt(compiler);
    expect(k).toBeDefined();
    expect(k).toBe(2);
    expect(compiler.pos).toBe(1);
  });
  it("UnsignedLongInt", () => {
    const compiler = createTestCompiler("12345");
    const k = scanInt(compiler);
    expect(k).toBe(12345);
    expect(compiler.pos).toBe(5);
  });
  it("SignedShort", () => {
    const compiler = createTestCompiler("-1");
    const k = scanInt(compiler);
    expect(k).toBe(-1);
    expect(compiler.pos).toBe(2);
  });
  it("SignedLong", () => {
    const compiler = createTestCompiler("-123-");
    const k = scanInt(compiler);
    expect(k).toBe(-123);
    expect(compiler.pos).toBe(4);
  });
  it("Minus", () => {
    const compiler = createTestCompiler("-");
    const k = scanInt(compiler);
    expect(k).toBeUndefined();
    expect(compiler.pos).toBe(0);
  });
});
