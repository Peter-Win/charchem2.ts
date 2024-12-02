import { compile } from "../../compiler/compile";

describe("ChemExpr", () => {
  it("html", () => {
    const expr = compile("H2O");
    expect(expr.html()).toBe("H<sub>2</sub>O");
  });
  it("isLinear", () => {
    expect(compile("H2SO4").isLinear()).toBe(true);
    expect(compile("CH3-CH2-OH").isLinear()).toBe(true);
    expect(compile("CH3-C<||O>-CH3").isLinear()).toBe(false);
  });
  it("srcMapItemText", () => {
    const expr = compile(
      "O2 + 2H2 + Al@:c(a)<_(A&a)C_(a0,N3)N>@(-90)@c(30)@c(150)",
      { srcMap: true }
    );
    expect(expr.getMessage()).toBe("");
    const agents = expr.getAgents();
    expect(agents.length).toBe(3);
    // 0
    const mi0 = expr.findMapItems(agents[0]!);
    expect(mi0.length).toBe(1);
    expect(expr.srcMapItemText(mi0[0]!)).toBe("O2");
    // 1
    const mi1 = expr.findMapItems(agents[1]!);
    expect(mi1.length).toBe(2);
    expect(mi1[0]!.part).toBe("agentK");
    expect(expr.srcMapItemText(mi1[0]!)).toBe("2");
    expect(mi1[1]!.part).toBeUndefined();
    expect(expr.srcMapItemText(mi1[1]!)).toBe("H2");
    // 2
    const mi2 = expr.findMapItems(agents[2]!);
    expect(mi2.length).toBe(1);
    // раскрытый макрос
    expect(expr.srcMapItemText(mi2[0]!)).toBe(
      "Al<_(A-90)C_(a0,N3)N><_(A30)C_(a0,N3)N><_(A150)C_(a0,N3)N>"
    );
  });
});
