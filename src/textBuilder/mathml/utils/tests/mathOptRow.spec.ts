import { TextNode } from "../../../buildTextNodes/TextNode";
import { FnNodeToXml } from "../../../xmlNode/FnNodeToXml";
import { XmlNode } from "../../../xmlNode/XmlNode";
import { mathOptRow } from "../mathOptRow";

const create: FnNodeToXml = (src) => {
  if (src.type === "text") {
    return { tag: "mtext", content: src.text };
  }
  throw Error(`Invalid text node type ${src.type}`);
};

describe("mathOptRow", () => {
  it("single item", () => {
    const list: TextNode[] = [{ type: "text", text: "Single" }];
    expect(mathOptRow(list, create)).toEqual({
      tag: "mtext",
      content: "Single",
    } satisfies XmlNode);
  });
  it("a few items", () => {
    const list: TextNode[] = [
      { type: "text", text: "First" },
      { type: "text", text: "Second" },
      { type: "text", text: "Third" },
    ];
    expect(mathOptRow(list, create)).toEqual({
      tag: "mrow",
      content: [
        { tag: "mtext", content: "First" },
        { tag: "mtext", content: "Second" },
        { tag: "mtext", content: "Third" },
      ],
    } satisfies XmlNode);
  });
  it("empty", () => {
    expect(mathOptRow([], create)).toEqual({
      tag: "mrow",
    });
  });
});
