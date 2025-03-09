import { compile } from "../../../compiler/compile";
import { buildTextNodes } from "../../buildTextNodes";
import { buildCharChemText } from "../buildCharChemText";

const cvt = (code: string): string => {
  const expr = compile(code);
  if (!expr.isOk()) throw Error(expr.getMessage());
  const srcNode = buildTextNodes(expr);
  return buildCharChemText(srcNode);
};

describe("buildCharChemText", () => {
  it("atom", () => {
    expect(cvt("Al")).toBe("Al");
    expect(cvt("H2SO4")).toBe("H2SO4");
    expect(cvt("Fe'2x+1'")).toBe("Fe'2x+1'");
    expect(cvt("$M(14)C")).toBe("$M(14)C");
    expect(cvt("$nM(14)C")).toBe("$nM(14)C");
  });
  it("custom", () => {
    expect(cvt("{R}OH")).toBe("{R}OH");
    expect(cvt("{R^1}OH")).toBe("{R^1}OH");
    expect(cvt("$nM(1,0){n}")).toBe("$nM(1,0){n}");
  });
  it("comment", () => {
    expect(cvt(`Al"*"`)).toBe(`Al"*"`);
    expect(cvt(`H2"|^"`)).toBe(`H2"↑"`); // magic chars
    expect(cvt(`Ba", [Delta]=105"`)).toBe(`Ba", Δ=105"`); // greek
    expect(cvt(`H"A\\color{red}B"`)).toBe(`H"A\\color{red}B"`); // TeX
  });
  it("oxidation state", () => {
    expect(cvt("Fe(ii)S(+6)O(-2)4")).toBe("Fe(ii)S(+6)O(-2)4");
  });
  it("cc charge", () => {
    expect(cvt("SO4^2-")).toBe("SO4^2-");
    expect(cvt("SO4`^-2")).toBe("SO4`^-2");
  });
  it("brackets", () => {
    expect(cvt("K3[Fe(CN)6]")).toBe("K3[Fe(CN)6]");
    expect(cvt("{{{R}}}")).toBe("{{{R}}}");
    expect(cvt("[OH]`'n'")).toBe("[OH]`'n'");
    expect(cvt("{{Cu}}`^-2")).toBe("{{Cu}}`^-2");
  });
  it("comma", () => {
    expect(cvt("(Ca,Mg)SO4")).toBe("(Ca,Mg)SO4");
  });
  it("mul", () => {
    expect(cvt("CuSO4*5H2O")).toBe("CuSO4*5H2O");
  });
  it("agent-agent space", () => {
    expect(cvt("B C")).toBe("B C");
    expect(cvt("2B 4C")).toBe("2B 4C");
  });
  it("bonds", () => {
    expect(cvt("CH3-(C=O)-C%N")).toBe("CH3-(C=O)-C%N");
  });
  it("radical", () => {
    expect(cvt("Et2O")).toBe("Et2O");
    expect(cvt("{Et}-OH")).toBe("Et-OH");
    expect(cvt("{tBu}-C(=O)-{t-Bu}")).toBe("{tBu}-C(=O)-{t-Bu}");
  });
  it("operation", () => {
    expect(cvt("2H2 + O2 = 2H2O")).toBe("2H2 + O2 = 2H2O");
    expect(cvt(`{A} "H_2O"--> {B}`)).toBe(`{A} "H_2O"--> {B}`);
    expect(cvt(`{A} "above"<-->"below" {B}`)).toBe(
      `{A} "above"<-->"below" {B}`
    );
    expect(cvt(`{A} <--"below" {B}`)).toBe(`{A} <--"below" {B}`);
  });
  it("cc colors", () => {
    expect(
      cvt(`$color(brown)3Br2$color() + 2Al → 2Al$itemColor1(brown)Br3`)
    ).toBe(`$color(brown)3Br2$color() + 2Al → 2Al$color(brown)Br3`);
  });
  it("atomColor", () => {
    expect(cvt(`$color(blue)$atomColor(red)2H2SO4`)).toBe(
      "$color(blue)2$atomColor(red)H2SO4"
    );
    expect(cvt(`$atomColor1(red)H2SO4`)).toBe(`$atomColor1(red)H2SO4`);
    expect(cvt(`$color(blue)$atomColor1(red)2H2S$atomColor1(brown)O4`)).toBe(
      `$color(blue)2$atomColor1(red)H2S$atomColor(brown)O4`
    );
  });
});
