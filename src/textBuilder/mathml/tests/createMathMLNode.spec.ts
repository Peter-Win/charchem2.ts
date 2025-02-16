import { compile } from "../../../compiler/compile";
import { PeriodicTable } from "../../../core/PeriodicTable";
import { buildTextNodes } from "../../buildTextNodes/buildTextNodes";
import { renderXmlNode } from "../../xmlNode/renderXmlNode";
import { XmlNode } from "../../xmlNode/XmlNode";
import { createMathMLNode } from "../createMathMLNode";
import { optimizeXmlColors } from "../../xmlNode/optimizeXmlColors";
import { ChemObj } from "../../../core/ChemObj";
import { CtxCreateMathMLNode } from "../CtxCreateMathMLNode";

const ctx: CtxCreateMathMLNode = {};

describe("createMathMLNode", () => {
  it("atom", () => {
    expect(
      createMathMLNode(
        {
          type: "atom",
          atom: PeriodicTable.dict.Fe,
          color: "brown",
        },
        ctx
      )
    ).toEqual({
      tag: "mi",
      color: "brown",
      content: "Fe",
    } satisfies XmlNode);

    expect(
      createMathMLNode(
        {
          type: "atom",
          atom: PeriodicTable.dict.K,
        },
        ctx
      )
    ).toEqual({
      tag: "mi",
      attrs: { mathvariant: "normal" },
      content: "K",
    } satisfies XmlNode);
  });
  it("custom", () => {
    const expr = compile("{R}");
    expect(expr.getMessage()).toBe("");
    let custom: ChemObj | undefined;
    expr.walk({
      custom(obj) {
        custom = obj;
      },
    });
    expect(custom).toBeDefined();
    const txn = buildTextNodes(custom!);
    expect(txn.type).toBe("group");
    expect(txn.items?.length).toBe(1);
    const it = txn.items?.[0]!;
    expect(it).toBeDefined();
    expect(it.type).toBe("custom");
    expect(it.items?.length).toBe(1);
    const rt = it.items?.[0]!;
    expect(rt?.type).toBe("richText");
    expect(rt.items?.length).toBe(1);
    expect(rt.items?.[0]).toHaveProperty("text", "R");

    const mn = createMathMLNode(txn, ctx)!;
    expect(mn).toBeDefined();
    expect(mn.content).toBe("R");
    expect(mn.tag).toBe("mi");
  });

  const cvt = (code: string): string => {
    const expr = compile(code);
    if (!expr.isOk()) return expr.getMessage();
    const txn = buildTextNodes(expr);
    const xn = createMathMLNode(txn, ctx);
    if (!xn) return "<undefined />";
    optimizeXmlColors(xn);
    return renderXmlNode(xn);
  };
  it("item", () => {
    expect(cvt("Al")).toBe("<mi>Al</mi>");
    expect(cvt("H2O")).toBe(
      `<mrow><msub><mi mathvariant="normal">H</mi><mn>2</mn></msub><mi mathvariant="normal">O</mi></mrow>`
    );
    // isotope
    expect(cvt("D2")).toBe(
      `<msub><mi mathvariant="normal">D</mi><mn>2</mn></msub>`
    );
    // abstract element
    expect(cvt("{R}")).toBe(`<mi mathvariant="normal">R</mi>`);
    expect(cvt("{R^1}")).toBe(
      `<msup><mi mathvariant="normal">R</mi><mn>1</mn></msup>`
    );
    expect(cvt("$color(green){Hal_2}")).toBe(
      `<msub style="color: green;"><mi>Hal</mi><mn>2</mn></msub>`
    );
    // radical
    expect(cvt("Me2O")).toBe(
      `<mrow><msub><mi>Me</mi><mn>2</mn></msub><mi mathvariant="normal">O</mi></mrow>`
    );
    // comma
    expect(cvt("Ca,Mg")).toBe(`<mrow><mi>Ca</mi><mo>,</mo><mi>Mg</mi></mrow>`);
    // comment
    expect(cvt(`Fe"AB{\\color{red}CD}EF"`)).toBe(
      `<mrow><mi>Fe</mi><mrow><mtext>AB</mtext><mtext style="color: red;">CD</mtext><mtext>EF</mtext></mrow></mrow>`
    );
  });

  it("space in comment", () => {
    expect(cvt(`Cu"; "Cd`)).toBe(
      `<mrow><mi>Cu</mi><mtext>;&nbsp;</mtext><mi>Cd</mi></mrow>`
    );
  });
});
