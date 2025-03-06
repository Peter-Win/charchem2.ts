import { compile } from "../../../compiler/compile";
import { ChemNodeItem } from "../../../core/ChemNodeItem";
import { buildTextNodes } from "../../buildTextNodes";
import { createHtmlRichNodes, CtxHtmlRich } from "../createHtmlRichNodes";
import { idGenBase } from "../idGenBase";
import { renderXmlNode, renderXmlNodes } from "../../xmlNode/renderXmlNode";

describe("createHtmlRichNode", () => {
  it("item", () => {
    const expr = compile("Al");
    expect(expr.getMessage()).toBe("");
    let item: ChemNodeItem | undefined;
    expr.walk({
      itemPre(obj) {
        item = obj;
      },
    });
    expect(item).toBeDefined();
    const textNode = buildTextNodes(item!);
    expect(textNode.items?.[0]?.type).toBe("item");

    const ctx: CtxHtmlRich = {};

    expect(renderXmlNode(createHtmlRichNodes(textNode, ctx)[0]!)).toBe(
      `<span class="cch-expr"><span>Al</span></span>`
    );

    const ctx1: CtxHtmlRich = {
      options: {
        idGen: idGenBase("t_"),
        srcMap: true,
      },
      srcMap: {},
    };
    expect(renderXmlNode(createHtmlRichNodes(textNode, ctx1)[0]!)).toBe(
      `<span id="t_1" class="cch-expr"><span id="t_2" class="cch-node-item"><span id="t_3">Al</span></span></span>`
    );
    const srcMap = ctx1.srcMap!;
    expect(srcMap).toBeDefined();
    expect(srcMap).toHaveProperty("t_1.txtNode.type", "group");
    expect(srcMap).toHaveProperty("t_2.txtNode.type", "item");
    expect(srcMap).toHaveProperty("t_3.txtNode.type", "atom");
  });

  it("space in text", () => {
    const expr = compile(`C"; \\color{blue}*"`);
    expect(expr.getMessage()).toBe("");
    const textNode = buildTextNodes(expr);
    const nodes = createHtmlRichNodes(textNode, {});
    const res = renderXmlNodes(nodes);
    expect(res).toBe(
      `<span class="cch-expr"><span class="cch-agent"><span>C</span><span>;&nbsp;</span><span style="color: blue">*</span></span></span>`
    );
  });
});
