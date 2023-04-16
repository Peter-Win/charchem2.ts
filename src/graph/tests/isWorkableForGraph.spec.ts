import { compile } from "../../compiler/compile";
import { isWorkableForGraph } from "../isWorkableForGraph";

describe("isWorkableForGraph", () => {
  it("Geologic", () => {
    expect(isWorkableForGraph(compile("(Fe,Zn)SO4"))).toBe(false);
  });
  it("Abstract coefficients", () => {
    expect(isWorkableForGraph(compile("H3C-(CH2)'n'-CH3"))).toBe(false);
    expect(isWorkableForGraph(compile("Fe'n'O'm'"))).toBe(false);
  });
  it("Success", () => {
    expect(isWorkableForGraph(compile("H2SO4"))).toBe(true);
    expect(isWorkableForGraph(compile("{M}2SO4"))).toBe(true);
    expect(
      isWorkableForGraph(
        compile(`CaCO3 + H2SO4"(aq)" -> CaSO4"|v" + CO2"|^" + H2O`)
      )
    ).toBe(true);
  });
});
