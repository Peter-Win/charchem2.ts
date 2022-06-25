import { applyParamValues } from "../execMacros";
import { PreProcCtx } from "../PreProcCtx";
import { MacroParams } from "../readFormalPars";

describe("ApplyParamValues", () => {
  it("UseRealParams", () => {
    const def: MacroParams = {
      dict: { x: "xDef", y: "yDef" },
      names: ["x", "y"],
    };
    const params = ["xReal", "yReal"];
    const ctx0 = new PreProcCtx("(&x+&y)");
    const ctx1 = applyParamValues(def, params, ctx0);
    expect(ctx1.src).toBe("(xReal+yReal)");
  });

  it("UseDefaultParams", () => {
    const def = { dict: { x: "xDef", y: "yDef" }, names: ["x", "y"] };
    const params: string[] = [];
    const ctx0 = new PreProcCtx("(&x+&y)");
    const ctx1 = applyParamValues(def, params, ctx0);
    expect(ctx1.src).toBe("(xDef+yDef)");
  });

  it("UseSimilarNames", () => {
    const def = {
      dict: { x: "1", xx: "2", xxx: "3" },
      names: ["x", "xx", "xxx"],
    };
    const params = ["one"];
    const ctx0 = new PreProcCtx("[&xxx, &xx, &x]");
    const ctx1 = applyParamValues(def, params, ctx0);
    expect(ctx1.src).toBe("[3, 2, one]");
  });
});
