import { createTestCompiler } from "../../ChemCompiler";
import { isId, scanId } from "../scanId";

describe("scanId", () => {
  it("Good", () => {
    const compiler = createTestCompiler("A,Bc,DE,fg,h,i1,j23,k1L2");
    expect(scanId(compiler)).toBe("A");
    compiler.pos++;
    expect(scanId(compiler)).toBe("Bc");
    compiler.pos++;
    expect(scanId(compiler)).toBe("DE");
    compiler.pos++;
    expect(scanId(compiler)).toBe("fg");
    compiler.pos++;
    expect(scanId(compiler)).toBe("h");
    compiler.pos++;
    expect(scanId(compiler)).toBe("i1");
    compiler.pos++;
    expect(scanId(compiler)).toBe("j23");
    compiler.pos++;
    expect(scanId(compiler)).toBe("k1L2");
  });
  it("Fail", () => {
    const compiler = createTestCompiler("-1*Ж_/");
    expect(compiler.curChar()).toBe("-");
    expect(scanId(compiler)).toBeUndefined();
    compiler.pos++;

    expect(compiler.curChar()).toBe("1");
    expect(scanId(compiler)).toBeUndefined();
    compiler.pos++;

    expect(compiler.curChar()).toBe("*");
    expect(scanId(compiler)).toBeUndefined();
    compiler.pos++;

    expect(compiler.curChar()).toBe("Ж");
    expect(scanId(compiler)).toBeUndefined();
    compiler.pos++;

    expect(compiler.curChar()).toBe("_");
    expect(scanId(compiler)).toBeUndefined();
    compiler.pos++;

    expect(compiler.curChar()).toBe("/");
    expect(scanId(compiler)).toBeUndefined();
    compiler.pos++;
  });
  it("isId", () => {
    expect(isId("A")).toBe(true);
    expect(isId("hello1")).toBe(true);
    expect(isId("")).toBe(false);
    expect(isId("1")).toBe(false);
    expect(isId(" ")).toBe(false);
    expect(isId("hello!")).toBe(false);
  });
});
