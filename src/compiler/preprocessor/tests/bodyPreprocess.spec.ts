import { bodyPreprocess } from "../bodyPreprocess";
import { globalMacros } from "../Macros";
import { PreProcCtx } from "../PreProcCtx";

describe("BodyPreprocess", () => {
  it("WithoutMacro", () => {
    const ctx = new PreProcCtx("H2SO4");
    bodyPreprocess(ctx);
    expect(ctx.dst).toBe("H2SO4");
  });
  it("SingleMacroUsing", () => {
    const ctx = new PreProcCtx("a+@point(x,1)");
    bodyPreprocess(ctx);
    expect(ctx.dst).toBe("a+@point(x,1)");
  });
  it("EndBySemicolon", () => {
    const ctx = new PreProcCtx("@:A()first+@second(x,y)@;next", 5);
    bodyPreprocess(ctx);
    expect(ctx.dst).toBe("first+@second(x,y)");
  });
  it("EndByExec", () => {
    const ctx = new PreProcCtx("@:A(x,y)@B(&x)+&y@(1,2)", 8);
    bodyPreprocess(ctx);
    expect(ctx.dst).toBe("@B(&x)+&y");
  });
  it("NestedMacroDefinition", () => {
    const ctx = new PreProcCtx("@:A(x,y)[@:B(p)(&p*&p)@(&x)+@B(&y)]@(2,3)", 8);
    bodyPreprocess(ctx);
    expect(ctx.dst).toBe("[@B(&x)+@B(&y)]");
    expect(globalMacros.B?.body).toBe("p)(&p*&p)");
  });
});
