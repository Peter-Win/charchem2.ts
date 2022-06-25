import { compile } from "../compile";

describe("OxidationState", () => {
  it("NitricAcid", () => {
    const expr = compile("H(+)N(+5)O(-2)3");
    expect(expr.getMessage()).toBe("");
    const { items } = expr.getAgents()[0]!.nodes[0]!;
    expect(items).toHaveLength(3);
    expect(items[0]?.charge?.text).toBe("+");
    expect(items[1]?.charge?.text).toBe("+5");
    expect(items[2]?.charge?.text).toBe("-2");
  });
});
