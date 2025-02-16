import { compile } from "../../../compiler/compile";
import { buildTextNodes } from "../../buildTextNodes/buildTextNodes";
import { renderXmlNode } from "../../xmlNode/renderXmlNode";
import { buildMathML } from "../buildMathML";

const makeMML = (code: string): string => {
  const expr = compile(code);
  if (!expr.isOk()) return expr.getMessage();
  const tnode = buildTextNodes(expr);
  const xnode = buildMathML(tnode, { namespace: false });
  return renderXmlNode(xnode);
};

describe("buildMathML", () => {
  it("atom", () => {
    expect(makeMML("He")).toBe("<math><mi>He</mi></math>");
    expect(makeMML("H")).toBe('<math><mi mathvariant="normal">H</mi></math>');
    expect(makeMML("Li2SO4")).toBe(
      '<math><mrow><msub><mi>Li</mi><mn>2</mn></msub><mi mathvariant="normal">S</mi><msub><mi mathvariant="normal">O</mi><mn>4</mn></msub></mrow></math>'
    );
  });
  it("Abstract element", () => {
    expect(makeMML("{Hal^1}")).toBe(
      "<math><msup><mi>Hal</mi><mn>1</mn></msup></math>"
    );
  });
  it("radical", () => {
    expect(makeMML("Me2O")).toBe(
      '<math><mrow><msub><mi>Me</mi><mn>2</mn></msub><mi mathvariant="normal">O</mi></mrow></math>'
    );
  });
  it("comment", () => {
    expect(makeMML(`GeSe2"|v"`)).toBe(
      "<math><mrow><mi>Ge</mi><msub><mi>Se</mi><mn>2</mn></msub><mtext>↓</mtext></mrow></math>"
    );
    expect(makeMML(`Fe"H_2SO_4"`)).toBe(
      `<math><mrow><mi>Fe</mi><mrow><msub><mtext>H</mtext><mn>2</mn></msub><msub><mtext>SO</mtext><mn>4</mn></msub></mrow></mrow></math>`
    );
  });
  it("comma", () => {
    expect(makeMML("Fe'0.75',Mn'0.25'")).toBe(
      "<math><mrow><msub><mi>Fe</mi><mi>0.75</mi></msub><mo>,</mo><msub><mi>Mn</mi><mi>0.25</mi></msub></mrow></math>"
    );
  });
  it("Agent coefficient", () => {
    expect(makeMML("2Ca")).toBe(
      "<math><mrow><mn>2</mn><mi>Ca</mi></mrow></math>"
    );
  });
  it("operation", () => {
    expect(makeMML(`Al + Br2`)).toBe(
      `<math><mrow><mi>Al</mi><mo>+</mo><msub><mi>Br</mi><mn>2</mn></msub></mrow></math>`
    );
    expect(makeMML(`Bi2Se3 + 3Fe "1000^oC"--> 2Bi + 3FeSe`)).toBe(
      `<math><mrow>` +
        `<mrow><msub><mi>Bi</mi><mn>2</mn></msub><msub><mi>Se</mi><mn>3</mn></msub></mrow>` +
        `<mo>+</mo>` +
        `<mrow><mn>3</mn><mi>Fe</mi></mrow>` +
        `<mover><mo>\u27F6</mo><mtext>1000°C</mtext></mover>` +
        `<mrow><mn>2</mn><mi>Bi</mi></mrow>` +
        `<mo>+</mo>` +
        `<mrow><mn>3</mn><mrow><mi>Fe</mi><mi>Se</mi></mrow></mrow>` +
        `</mrow></math>`
    );
  });
  it("brackets", () => {
    expect(makeMML("Ca(OH)2")).toBe(
      `<math><mrow><mi>Ca</mi><msub><mrow><mo>(</mo>` +
        `<mrow><mi mathvariant=\"normal\">O</mi><mi mathvariant=\"normal\">H</mi></mrow>` +
        `<mo>)</mo></mrow><mn>2</mn></msub></mrow></math>`
    );
  });
  it("bonds", () => {
    expect(makeMML("Me-Ge%As")).toBe(
      `<math><mrow><mi>Me</mi><mo lspace="0" rspace="0">–</mo>` +
        `<mi>Ge</mi><mo lspace="0" rspace="0">≡</mo>` +
        `<mi>As</mi></mrow></math>`
    );
  });
  it("charge", () => {
    expect(makeMML("{R}3^2-")).toBe(
      `<math><msubsup><mi mathvariant="normal">R</mi><mn>3</mn><mtext>2-</mtext></msubsup></math>`
    );
    expect(makeMML("Fe(+3)")).toBe(
      `<math><mover><mi>Fe</mi><mtext>+3</mtext></mover></math>`
    );
  });
  it("multiplication", () => {
    expect(makeMML("Al2*'x'Si")).toBe(
      `<math><mrow><msub><mi>Al</mi><mn>2</mn></msub><mo>⋅</mo><mrow><mi>x</mi><mi>Si</mi></mrow></mrow></math>`
    );
  });
  it("Atomic number and mass", () => {
    expect(makeMML("$nM(232)Th + $nM(1,0){n}")).toBe(
      `<math><mrow>` +
        `<mmultiscripts><mi>Th</mi><mrow /><mrow /><mprescripts /><mn>90</mn><mn>232</mn></mmultiscripts>` +
        `<mo>+</mo>` +
        `<mmultiscripts><mi mathvariant="normal">n</mi><mrow /><mrow /><mprescripts /><mn>0</mn><mn>1</mn></mmultiscripts>` +
        `</mrow></math>`
    );
  });
  it("color", () => {
    expect(makeMML("$color(brown)3Br2")).toBe(
      `<math style="color: brown;"><mrow><mn>3</mn><msub><mi>Br</mi><mn>2</mn></msub></mrow></math>`
    );
  });
  it("rich text", () => {
    expect(makeMML(`"H_2SO_4"-->`)).toBe(
      `<math><mover><mo>⟶</mo><mrow><msub><mtext>H</mtext><mn>2</mn></msub><msub><mtext>SO</mtext><mn>4</mn></msub></mrow></mover></math>`
    );
  });
  it("reverse bonds", () => {
    expect(makeMML("Br`-Al`=Se")).toBe(
      `<math><mrow><mi>Se</mi><mo lspace="0" rspace="0">=</mo><mi>Al</mi><mo lspace="0" rspace="0">–</mo><mi>Br</mi></mrow></math>`
    );
  });
  it("reverse bonds with brackets", () => {
    expect(makeMML("Me-(Ga`=Se)")).toBe(
      `<math><mrow><mi>Me</mi><mo lspace="0" rspace="0">–</mo><mrow><mo>(</mo><mi>Se</mi><mo lspace="0" rspace="0">=</mo><mi>Ga</mi><mo>)</mo></mrow></mrow></math>`
    );
  });
  it("space", () => {
    expect(makeMML("Fe Mn")).toBe(
      `<math><mrow><mi>Fe</mi><mspace width="0.5em" /><mi>Mn</mi></mrow></math>`
    );
  });
});
