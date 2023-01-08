import { compile } from "../../compiler/compile";
import { makeSourceWithNewCoeffs } from "../makeSourceWithNewCoeffs";

describe("makeSourceWithNewCoeffs", () => {
  it("Al(OH)3 + H2SO4", () => {
    // Correct equation: 2Al(OH)3 + 3H2SO4 → Al2(SO4)3 + 6H2O
    const src = `11Al(OH)3 + H2SO4 → 7Al2(SO4)3 + H2O`;
    const expr = compile(src, { srcMap: true });
    expect(expr.getMessage()).toBe("");
    const { srcMap } = expr;
    expect(srcMap).toBeDefined();

    const coeffs = [2, 3, 1, 6];
    const agents = expr.getAgents();
    const newSrc = makeSourceWithNewCoeffs(coeffs, agents, src, srcMap!);
    expect(newSrc).toBe("2Al(OH)3 + 3H2SO4 → Al2(SO4)3 + 6H2O");
  });

  it("Si(OC2H5)4 → SiO2 + Et2O", () => {
    const src = "Si(OC2H5)4 → SiO2 + Et2O";
    const expr = compile(src, { srcMap: true });
    expect(expr.getMessage()).toBe("");
    const newSrc = makeSourceWithNewCoeffs(
      [1, 1, 2],
      expr.getAgents(),
      src,
      expr.srcMap!
    );
    expect(newSrc).toBe("Si(OC2H5)4 → SiO2 + 2Et2O");
  });
});
