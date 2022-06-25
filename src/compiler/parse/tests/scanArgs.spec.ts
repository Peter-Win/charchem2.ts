import { createTestCompiler } from "../../ChemCompiler";
import { scanArgs } from "../scanArgs";
import { getErrorMessage } from "../../../core/ChemError";

describe("scanArgs", () => {
  it("Single", () => {
    const c = createTestCompiler("a(B)c");
    c.pos = 2;
    expect(c.curChar()).toBe("B");
    const { args, argPos } = scanArgs(c);
    expect(c.curChar()).toBe("c");
    expect(args).toEqual(["B"]);
    expect(argPos).toEqual([2]);
  });
  it("Empty", () => {
    const c = createTestCompiler("a()c");
    c.pos = 2;
    expect(c.curChar()).toBe(")");
    const { args, argPos } = scanArgs(c);
    expect(c.curChar()).toBe("c");
    expect(argPos).toEqual([]);
    expect(args).toEqual([]);
  });
  it("Three", () => {
    const c = createTestCompiler("a(one,two,three)e");
    c.pos = 2;
    const { args, argPos } = scanArgs(c);
    expect(c.curChar()).toBe("e");
    expect(args).toEqual(["one", "two", "three"]);
    expect(argPos).toEqual([2, 6, 10]);
  });
  it("Nested", () => {
    const c = createTestCompiler("_(A(),B(x),C(D(y),E(z)))e");
    c.pos = 2;
    const { args, argPos } = scanArgs(c);
    expect(c.curChar()).toBe("e");
    expect(args).toEqual(["A()", "B(x)", "C(D(y),E(z))"]);
    expect(argPos).toEqual([2, 6, 11]);
  });
  it("NotClosed", () => {
    const c = createTestCompiler("_(hello");
    c.pos = 2;
    let msg = "";
    try {
      scanArgs(c);
    } catch (err) {
      msg = getErrorMessage(err, "ru");
    }
    expect(msg).toBe("Необходимо закрыть скобку, открытую в позиции 2");
  });
  it("NotClosedNested", () => {
    const c = createTestCompiler("_(hello()");
    c.pos = 2;
    let msg = "";
    try {
      scanArgs(c);
    } catch (err) {
      msg = getErrorMessage(err, "ru");
    }
    expect(msg).toBe("Необходимо закрыть скобку, открытую в позиции 2");
  });
});
