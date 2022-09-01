import { makeTextFormula, makeTextFormulaSrc } from "../makeTextFormula";
import { rulesText } from "../../textRules/rulesText";
import { rulesHtml } from "../../textRules/rulesHtml";
import { rulesBB } from "../../textRules/rulesBB";
import { rulesCharChem } from "../../textRules/rulesCharChem";
import { rulesMhchem } from "../../textRules/rulesMhchem";
import { compile } from "../../compiler/compile";
import { rulesRTF } from "../../textRules/rulesRTF";

const span = (text: string, color: string) =>
  `<span style="color:${color}">${text}</span>`;
const sub = (text: string | number) => `<sub>${text}</sub>`;
const bbColor = (text: string, color: string) =>
  `[color=${color}]${text}[/color]`;

describe("makeTextFormula", () => {
  it("Simple", () => {
    expect(makeTextFormulaSrc("Li", rulesText)).toBe("Li");
    expect(makeTextFormulaSrc("H2", rulesText)).toBe("H2");
    expect(makeTextFormulaSrc("H2O", rulesText)).toBe("H2O");
    expect(makeTextFormulaSrc("2H2O", rulesText)).toBe("2H2O");
    expect(makeTextFormulaSrc("C'n'H'2n+2'", rulesText)).toBe("CnH2n+2");
    expect(makeTextFormulaSrc("{R}OH", rulesText)).toBe("ROH");
    expect(makeTextFormulaSrc("P{Me}3", rulesText)).toBe("PMe3");
    expect(makeTextFormulaSrc('"+[Delta]"CO2"|^"', rulesText)).toBe("+ΔCO2↑");
    expect(makeTextFormulaSrc("2H2 + O2 = 2H2O", rulesText)).toBe(
      "2H2 + O2 = 2H2O"
    );
    expect(makeTextFormulaSrc("SO4^2-", rulesText)).toBe("SO42-");
    expect(makeTextFormulaSrc("SO4`^-2", rulesText)).toBe("-2SO4");
  });
  it("Reverse", () => {
    expect(makeTextFormulaSrc("Br`-(C=O)`-Cl", rulesText)).toBe("Cl-(C=O)-Br");
  });
  it("Color Simple", () => {
    const e1 = compile("$color(magenta)H2$color()O");
    expect(e1.getMessage()).toBe("");
    expect(makeTextFormula(e1)).toBe("H2O");
    expect(makeTextFormula(e1, rulesHtml)).toBe(
      `<span style="color:magenta">H<sub>2</sub></span>O`
    );
    expect(makeTextFormula(e1, rulesBB)).toBe(
      `${bbColor("H[sub]2[/sub]", "magenta")}O`
    );
    expect(makeTextFormula(e1, rulesMhchem)).toBe("\\color{magenta}{H_{2}}O");
    expect(makeTextFormula(e1, rulesCharChem)).toBe(
      "$color(magenta)H2$color()O"
    );
  });
  it("Two Colors", () => {
    const e2 = compile("$color(blue)H2$color(red)S$color()O4");
    expect(e2.getMessage()).toBe("");
    expect(makeTextFormula(e2)).toBe("H2SO4");
    expect(makeTextFormula(e2, rulesHtml)).toBe(
      `${span(`H${sub(2)}`, "blue") + span("S", "red")}O${sub(4)}`
    );
    expect(makeTextFormula(e2, rulesBB)).toBe(
      `${bbColor("H[sub]2[/sub]", "blue") + bbColor("S", "red")}O[sub]4[/sub]`
    );
    expect(makeTextFormula(e2, rulesMhchem)).toBe(
      "\\color{blue}{H_{2}}\\color{red}{S}O_{4}"
    );
    expect(makeTextFormula(e2, rulesCharChem)).toBe(
      "$color(blue)H2$color(red)S$color()O4"
    );
  });
  it("Item Color", () => {
    const expr = compile("$color(gray)$itemColor(brown){R}-OH");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("R-OH");
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      `<span style="color:brown"><i>R</i></span><span style="color:gray">-</span><span style="color:brown">OH</span>`
    );
    expect(makeTextFormula(expr, rulesBB)).toBe(
      bbColor("[i]R[/i]", "brown") +
        bbColor("-", "gray") +
        bbColor("OH", "brown")
    );
    expect(makeTextFormula(expr, rulesMhchem)).toBe(
      "\\color{brown}{R}\\color{gray}{-}\\color{brown}{OH}"
    );
    expect(makeTextFormula(expr, rulesCharChem)).toBe(
      "$color(brown){R}$color(gray)-$color(brown)OH$color()"
    );
  });
  it("Atom Color", () => {
    const expr = compile(
      "$color(black)$itemColor(blue)$atomColor(red)Fe2(SO4)3"
    );
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("Fe2(SO4)3");
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      span("Fe", "red") +
        span(sub(2), "blue") +
        span("(", "black") +
        span("SO", "red") +
        span(sub("4"), "blue") +
        span(`)${sub(3)}`, "black")
    );
    expect(makeTextFormula(expr, rulesBB)).toBe(
      bbColor("Fe", "red") +
        bbColor("[sub]2[/sub]", "blue") +
        bbColor("(", "black") +
        bbColor("SO", "red") +
        bbColor("[sub]4[/sub]", "blue") +
        bbColor(")[sub]3[/sub]", "black")
    );
    expect(makeTextFormula(expr, rulesMhchem)).toBe(
      "\\color{red}{Fe}\\color{blue}{_{2}}\\color{black}{(}\\color{red}{SO}\\color{blue}{_{4}}\\color{black}{)_{3}}"
    );
  });
  it("Operation", () => {
    const expr = compile(
      `$atomColor1(red)3Ba^2+ + 2PO4^3- -> $atomColor1(red)Ba3(PO4)2"|v"`
    );
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("3Ba2+ + 2PO43- → Ba3(PO4)2↓");
    expect(makeTextFormula(expr, rulesBB)).toBe(
      `[b]3[/b]${bbColor(
        "Ba",
        "red"
      )}[sup]2+[/sup] + [b]2[/b]PO[sub]4[/sub][sup]3-[/sup] → ${bbColor(
        "Ba",
        "red"
      )}[sub]3[/sub](PO[sub]4[/sub])[sub]2[/sub][i]↓[/i]`
    );
    expect(makeTextFormula(expr, rulesMhchem)).toBe(
      `3\\color{red}{Ba}^{2+} + 2PO_{4}^{3-} -> \\color{red}{Ba}_{3}(PO_{4})_{2}↓`
    );
    expect(makeTextFormula(expr, rulesRTF)).toBe(
      "3Ba{\\super 2+} + 2PO{\\sub 4}{\\super 3-} {\\cf2\\rtlch \\ltrch\\loch \\u8594\\'3f} Ba{\\sub 3}(PO{\\sub 4}){\\sub 2}{\\cf2\\rtlch \\ltrch\\loch \\u8595\\'3f}"
    );
    // Пока предполагаем, что функции нельзя вставлять между атомом и коэффициентом
    //        assertEquals(makeTextFormula(expr, rulesCharChem),
    //                "3\$color(red)Ba\$color()^2+ + 2PO4^3- -> \$color(red)Ba\$color()3(PO4)2\"↓\"")
  });
  it("Operation With Comments", () => {
    //  [OH-]
    //  ————→
    //   +Δ
    const expr = compile(`"[OH-]"-->"+[Delta]"`);
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("[OH-]—→+Δ");
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      `<span class="echem-op"><span class="echem-opcomment">[OH-]</span><span class="chem-long-arrow">→</span><span class="echem-opcomment">+Δ</span></span>`
    );
    expect(makeTextFormula(expr, rulesBB)).toBe("[OH-]—→+Δ");
    expect(makeTextFormula(expr, rulesMhchem)).toBe("->[{[OH-]}][{+Δ}]");
    expect(makeTextFormula(expr, rulesCharChem)).toBe(`"[OH-]"-->"+Δ"`);
  });
  it("Markup in comment", () => {
    const expr = compile('{R^1}-"A_{123}"');
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("R1-A123");
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      "<i>R<sup>1</sup></i>-<em>A<sub>123</sub></em>"
    );
    expect(makeTextFormula(expr, rulesMhchem)).toBe("R^{1}-A_{123}");
  });
});
