import { compile } from "../compile";

describe("SimpleBondSuffix", () => {
  it("ZeroBond", () => {
    //     O--
    //  K+    H+
    const expr = compile("K^+/0O^--\\oH^+");
    expect(expr.getMessage()).toBe("");
    const { bonds } = expr.getAgents()[0]!;
    expect(bonds[0]!.n).toBe(0.0);
    expect(bonds[0]!.style).toBe("");
    expect(bonds[1]!.n).toBe(0.0);
    expect(bonds[1]!.style).toBe("");
  });
  it("HydrogenBond", () => {
    // H
    // 0\   2
    //   O∙∙∙∙∙H
    // 1/       \3  4
    // H         O----H
    const expr = compile("H\\O<`/H>--hH\\O-H");
    expect(expr.getMessage()).toBe("");
    const hBond = expr.getAgents()[0]!.bonds[2];
    expect(hBond!.n).toBe(0.0);
    expect(hBond!.style).toBe(":");
  });
  it("BondWidth", () => {
    const expr = compile("/wO\\ww|`/dO`\\dd`|");
    expect(expr.getMessage()).toBe("");
    const { bonds } = expr.getAgents()[0]!;
    expect(bonds.map((it) => `${it.w0},${it.w1}`)).toEqual([
      "0,1",
      "1,0",
      "0,0",
      "0,-1",
      "-1,0",
      "0,0",
    ]);
  });
  it("CrossAndWave", () => {
    const expr = compile("$L(1.4)O//xN\\~H");
    expect(expr.getMessage()).toBe("");
    const { bonds } = expr.getAgents()[0]!;
    expect(bonds[0]!.isCross()).toBe(true);
    expect(bonds[1]!.style).toBe("~");
  });
  it("Coord", () => {
    const expr = compile("$L(1.4)/vv-vvv\\v");
    expect(expr.getMessage()).toBe("");
    const { bonds } = expr.getAgents()[0]!;
    expect(
      bonds.map((it) => `${it.arr0 ? "<" : ""}-${it.arr1 ? ">" : ""}`)
    ).toEqual(["<-", "<->", "->"]);
  });
});
