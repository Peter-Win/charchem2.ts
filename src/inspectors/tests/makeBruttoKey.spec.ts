import { compile } from "../../compiler/compile";
import { makeBruttoKey } from "../makeBruttoKey";

describe("makeBruttoKey", () => {
  it("with error", () => {
    expect(makeBruttoKey("")).toBe("");
    expect(makeBruttoKey("(")).toBe("");
  });
  it("Abstract", () => {
    expect(makeBruttoKey("{R}-OH")).toBe("HO{R}");
    expect(makeBruttoKey("C'n'")).toBe("");
  });
  it("string", () => {
    expect(makeBruttoKey("CH3CH2-OH")).toBe("C2H6O");
    expect(makeBruttoKey("SO4^2-")).toBe("O4S^2-");
  });
  it("expression", () => {
    expect(makeBruttoKey(compile("H2O"))).toBe("H2O");
    expect(makeBruttoKey(compile("/\\\\|`//`\\`||"))).toBe("C6H6");
    expect(makeBruttoKey(compile("R"))).toBe("");
    expect(makeBruttoKey(compile("NH4^+"))).toBe("H4N^+");
  });
});
