import { execMacros } from "../execMacros";

describe("ExecMacros", () => {
  it("Simple", () => {
    expect(execMacros(")test", [])).toBe("test");
    expect(execMacros("x)[&x*&x]", ["123"])).toBe("[123*123]");
    expect(execMacros("x:1,xx:2,xxx:3){&xxx,&xx,&x}", ["one"])).toBe(
      "{3,2,one}"
    );
  });
});
