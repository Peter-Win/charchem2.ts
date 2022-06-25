import { readFormalPars } from "../readFormalPars";
import { PreProcCtx } from "../PreProcCtx";

describe("readFormalPars", () => {
  it("Empty", () => {
    const { dict, names } = readFormalPars(new PreProcCtx("A() ", 2));
    expect(dict).toEqual({});
    expect(names).toHaveLength(0);
  });
  it("Single", () => {
    const { names, dict } = readFormalPars(new PreProcCtx("A(abc) ", 2));
    expect(names).toEqual(["abc"]);
    expect(dict).toEqual({ abc: "" });
  });
  it("WithDefaultValues", () => {
    const { names, dict } = readFormalPars(
      new PreProcCtx("first:1,second:2)", 0)
    );
    expect(names).toEqual(["first", "second"]);
    expect(dict).toEqual({ first: "1", second: "2" });
  });
});
