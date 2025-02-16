import { splitColumn } from "../../../buildTextNodes/splitColumn";
import { TextNode } from "../../../buildTextNodes/TextNode";
import { FnNodeToXml } from "../../../xmlNode/FnNodeToXml";
import { XmlNode } from "../../../xmlNode/XmlNode";
import { mathColumn } from "../mathColumn";

const create: FnNodeToXml = (src) => {
  if (src.type === "text") {
    return { tag: "mtext", content: src.text };
  }
  throw Error(`Invalid text node type ${src.type}`);
};

describe("mathColumn", () => {
  it("center only", () => {
    const src: TextNode[] = [{ type: "text", text: "Center" }];
    const res = mathColumn(splitColumn(src), create);
    expect(res).toBeDefined();
    expect(res).toEqual({
      tag: "mtext",
      content: "Center",
    });
  });

  it("top", () => {
    const src: TextNode[] = [
      { type: "text", text: "Main" },
      { type: "text", text: "Top", pos: "T" },
    ];
    const res = mathColumn(splitColumn(src), create);
    expect(res).toBeDefined();
    expect(res).toEqual({
      tag: "mover",
      content: [
        { tag: "mtext", content: "Main" },
        { tag: "mtext", content: "Top" },
      ],
    } satisfies XmlNode);
  });

  it("bottom", () => {
    const src: TextNode[] = [
      { type: "text", text: "Main" },
      { type: "text", text: "Bottom", pos: "B" },
    ];
    const res = mathColumn(splitColumn(src), create);
    expect(res).toBeDefined();
    expect(res).toEqual({
      tag: "munder",
      content: [
        { tag: "mtext", content: "Main" },
        { tag: "mtext", content: "Bottom" },
      ],
    } satisfies XmlNode);
  });

  it("top and bottom", () => {
    const src: TextNode[] = [
      { type: "text", text: "Main" },
      { type: "text", text: "Top", pos: "T" },
      { type: "text", text: "Bottom", pos: "B" },
    ];
    const res = mathColumn(splitColumn(src), create);
    expect(res).toBeDefined();
    expect(res).toEqual({
      tag: "munderover",
      content: [
        { tag: "mtext", content: "Main" },
        { tag: "mtext", content: "Bottom" },
        { tag: "mtext", content: "Top" },
      ],
    } satisfies XmlNode);
  });
});
