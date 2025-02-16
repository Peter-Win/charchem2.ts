import { createTestCompiler } from "../../ChemCompiler";
import { scanOp } from "../scanOp";

describe("scanOp", () => {
  it("Long", () => {
    const compiler = createTestCompiler("-->");
    const res = scanOp(compiler);
    expect(res).toBeDefined();
    expect(res!.src).toBe("-->");
    expect(compiler.pos).toBe(3);
  });
  it("Short", () => {
    const compiler = createTestCompiler("->");
    const res = scanOp(compiler);
    expect(res).toBeDefined();
    expect(res!.src).toBe("->");
    expect(compiler.pos).toBe(2);
    expect(res!.div).toBe(true);
  });
  it("Plus", () => {
    const compiler = createTestCompiler("O2 + H2");
    const p1 = scanOp(compiler);
    expect(p1).toBeUndefined();
    expect(compiler.pos).toBe(0);
    compiler.pos = 3;
    const p2 = scanOp(compiler);
    expect(p2).toBeDefined();
    expect(p2!.src).toBe("+");
    expect(p2!.div).toBe(false);
    expect(compiler.pos).toBe(4);
  });
  it("not equal", () => {
    const compiler = createTestCompiler("!=");
    const res = scanOp(compiler);
    expect(res).toBeDefined();
    expect(res!.src).toBe("!=");
    expect(compiler.pos).toBe(2);
    expect(res!.div).toBe(true);
  });
  it("Difference Between Op And Bond", () => {
    const compiler = createTestCompiler("=|="); // = is not op
    const res = scanOp(compiler);
    expect(res).toBeUndefined();
  });
  it("Long Leftwards Arrow", () => {
    //                                   012345
    const compiler = createTestCompiler("B <-- C");
    compiler.pos = 2;
    const res = scanOp(compiler);
    expect(res).toBeDefined();
    expect(res!.src).toBe("<--");
    expect(compiler.pos).toBe(5);
  });
});
