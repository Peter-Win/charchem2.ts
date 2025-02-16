import { renderXmlNode, renderXmlNodes } from "../renderXmlNode";
import { XmlNode } from "../XmlNode";

describe("renderXmlNode", () => {
  it("Empty tag", () => {
    expect(
      renderXmlNode({
        tag: "br",
      })
    ).toBe("<br />");
    expect(
      renderXmlNode({
        tag: "meta",
        attrs: { charset: "utf-8" },
      })
    ).toBe(`<meta charset="utf-8" />`);
  });
  it("text content", () => {
    const node: XmlNode = {
      tag: "div",
      attrs: { "data-size": "small" },
      color: "magenta",
      content: "value < 5",
    };
    expect(renderXmlNode(node)).toBe(
      `<div data-size="small" style="color: magenta;">value &lt; 5</div>`
    );
    expect(renderXmlNode(node, { indent: " " }, 2)).toBe(
      `  <div data-size="small" style="color: magenta;">value &lt; 5</div>\n`
    );
  });
  it("sub nodes 1", () => {
    const node: XmlNode = {
      tag: "math",
      content: [
        { tag: "mi", attrs: { mathvariant: "normal" }, content: "a" },
        { tag: "mo", content: "=" },
        { tag: "mn", content: "5" },
      ],
    };
    expect(renderXmlNode(node)).toBe(
      `<math><mi mathvariant="normal">a</mi><mo>=</mo><mn>5</mn></math>`
    );
    expect(renderXmlNode(node, { indent: "  " })).toBe(
      `<math>\n  <mi mathvariant="normal">a</mi>\n  <mo>=</mo>\n  <mn>5</mn>\n</math>\n`
    );
  });

  it("sub nodes 2", () => {
    const node: XmlNode = {
      tag: "level1",
      content: [
        {
          tag: "level2",
          content: [{ tag: "level3" }],
        },
      ],
    };
    expect(renderXmlNode(node)).toBe(
      `<level1><level2><level3 /></level2></level1>`
    );
    expect(renderXmlNode(node, { indent: "  " })).toBe(
      `<level1>\n  <level2>\n    <level3 />\n  </level2>\n</level1>\n`
    );
  });
});

test("renderXmlNodes", () => {
  const n1: XmlNode = {
    tag: "span",
    attrs: { id: "A" },
    content: "Abc",
  };
  const n2: XmlNode = {
    tag: "div",
    content: [{ tag: "hr" }],
  };
  expect(renderXmlNodes(undefined)).toBe("");
  expect(renderXmlNodes([], {}, 1)).toBe("");
  expect(renderXmlNodes([n1], { indent: " " })).toBe(
    `<span id="A">Abc</span>\n`
  );
  expect(renderXmlNodes([n1, n2], { indent: "  ", noSelfClosed: true })).toBe(
    `<span id="A">Abc</span>\n<div>\n  <hr></hr>\n</div>\n`
  );
});
