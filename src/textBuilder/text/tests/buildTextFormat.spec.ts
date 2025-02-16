import { compile } from "../../../compiler/compile";
import { buildTextNodes } from "../../buildTextNodes";
import { buildTextFormat, OptionsTextFormat } from "../buildTextFormat";
import { toSubscript } from "../../../utils/unicode/toSubscript";
import { toSuperscript } from "../../../utils/unicode/toSuperscript";

const toText = (code: string, options?: OptionsTextFormat): string => {
  const expr = compile(code);
  if (!expr.isOk()) return expr.getMessage();
  const node = buildTextNodes(expr);
  return buildTextFormat(node, options);
};

describe("buildTextFormat", () => {
  it("sub items", () => {
    expect(toText("H2SO4")).toBe("H2SO4");
    expect(toText("H2O", { sub: "withUnderscore" })).toBe("H_2O");
    expect(toText("C2H5OH", { sub: toSubscript })).toBe("C₂H₅OH");
    expect(
      toText("H2S", {
        sub: (s) => `_${s}_`,
      })
    ).toBe("H_2_S");
  });

  it("sup items", () => {
    expect(toText("SO4^2-")).toBe("SO4^2-");
    expect(toText("SO4^2-", { sup: "text" })).toBe("SO42-");
    expect(
      toText("SO4^2-", {
        sup: (s) => `^{${s}}`,
      })
    ).toBe("SO4^{2-}");
  });

  it("left items", () => {
    expect(toText("SO4`^-2")).toBe("^-2SO4");
    expect(toText("$nM(14)C", { sub: "withUnderscore" })).toBe("^14_6C");
  });

  it("oxidation state", () => {
    expect(toText("Fe(+3)")).toBe("Fe");
    expect(
      toText("Fe(+3)", {
        oxidationState: "sup",
        sup: (s) => `^(${s})`,
      })
    ).toBe("Fe^(+3)");
    expect(
      toText("Fe(iii)^3+", {
        oxidationState: "sup",
        scriptDivider: ",",
        sup: (s) => `^[${s}]`,
      })
    ).toBe("Fe^[III,3+]");
    expect(
      toText("Fe(ii)2", {
        oxidationState: (c, x) => `${c}<${x}>`,
      })
    ).toBe("Fe<II>2");
    expect(
      toText("$M(16)O(+2)", {
        oxidationState: "*LT",
        scriptDivider: ";",
      })
    ).toBe("^+2;16O");
    expect(
      toText("$M(16)O(+2)", {
        oxidationState: "LT*",
        scriptDivider: ";",
      })
    ).toBe("^16;+2O");
  });

  it("brackets", () => {
    expect(toText("Ca(OH)2")).toBe("Ca(OH)2");
    expect(toText("Ca(OH)2", { sub: "withUnderscore" })).toBe("Ca(OH)_2");
    expect(toText("Ca(OH)2", { sub: (s) => s.replace("2", "\u2082") })).toBe(
      "Ca(OH)₂"
    );
    expect(toText("[OH]^-")).toBe("[OH]^-");
    expect(toText("[OH]^-", { sup: "text" })).toBe("[OH]-");
    expect(toText("[OH]`^-", { sup: "text" })).toBe("-[OH]");
    expect(toText("{{U}}")).toBe("{U}");
  });

  it("bonds", () => {
    expect(toText("O=CH-C%N")).toBe("O=CH-C≡N");
  });

  it("custom", () => {
    expect(toText("{R}OH")).toBe("ROH");
    expect(toText("{R^1}OH")).toBe("R^1OH");
    expect(toText("{R^1}OH", { sup: "text" })).toBe("R1OH");
    expect(toText("{R^1}OH", { sup: toSuperscript })).toBe("R¹OH");
    expect(toText("{A{\\color{red}BC}D}OH", { sup: toSuperscript })).toBe(
      "ABCDOH"
    );
  });

  it("item comment", () => {
    expect(toText(`H2"|^"`)).toBe("H2↑");
    expect(toText(`H2", [Delta]=1000"`)).toBe("H2, Δ=1000");
    expect(toText(`"A{\\color{red}BC}D"OH`, { sup: toSuperscript })).toBe(
      "ABCDOH"
    );
  });

  it("simple operations", () => {
    expect(toText("2H2 + O2 -> 2H2O")).toBe("2H2 + O2 -> 2H2O");
    expect(toText("2H2 + O2 -> 2H2O", { operations: "dstText" })).toBe(
      "2H2 + O2 → 2H2O"
    );
  });

  it("operations with comments", () => {
    expect(toText(`B "above"-->"below" C`)).toBe("B above->below C");
    expect(toText(`B "above"-->"below" C`, { opComments: "ignore" })).toBe(
      "B -> C"
    );
    expect(toText(`B "above"-->"below" C`, { opComments: "quoted" })).toBe(
      `B "above"->"below" C`
    );
    expect(toText(`B "above"-->"below" C`, { opComments: "quoted" })).toBe(
      `B "above"->"below" C`
    );
    const opComments = (text: string, where: "above" | "below") =>
      where === "above" ? `^${text}^` : `_${text}_`;
    expect(toText(`B "top"-->"bottom" C`, { opComments })).toBe(
      `B ^top^->_bottom_ C`
    );
    expect(
      toText(`{A} "H_2SO_4"--> {B}`, {
        sub: toSubscript,
        operations: "dstText",
      })
    ).toBe("A H₂SO₄—→ B");
  });

  it("mineral", () => {
    expect(toText(`(Ca'0.8',Mg'0.2')(OH)2CO3*15H2O`)).toBe(
      "(Ca0.8,Mg0.2)(OH)2CO3*15H2O"
    );
    expect(
      toText(`(Ca'0.8',Mg'0.2')(OH)2CO3*15H2O`, {
        mul: "×",
        sub: toSubscript,
      })
    ).toBe("(Ca₀.₈,Mg₀.₂)(OH)₂CO₃×15H₂O");
  });
});
