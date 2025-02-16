import { FnNodeToXml } from "../../../xmlNode/FnNodeToXml";
import { XmlNode } from "../../../xmlNode/XmlNode";
import { mathScripted } from "../mathScripted";

const create: FnNodeToXml = (src) => {
  if (src.type === "text") {
    return { tag: "mtext", content: src.text };
  }
  throw Error(`Invalid text node type ${src.type}`);
};

describe("mathScripted", () => {
  it("without script", () => {
    expect(mathScripted([{ type: "text", text: "Single" }], create)).toEqual({
      tag: "mtext",
      content: "Single",
    });

    expect(
      mathScripted(
        [
          { type: "text", text: "One" },
          { type: "text", text: "Two" },
        ],
        create
      )
    ).toEqual({
      tag: "mrow",
      content: [
        { tag: "mtext", content: "One" },
        { tag: "mtext", content: "Two" },
      ],
    } satisfies XmlNode);
  });

  it("sup", () => {
    expect(
      mathScripted(
        [
          { type: "text", text: "A" },
          { type: "text", text: "2", pos: "RT" },
        ],
        create
      )
    ).toEqual({
      tag: "msup",
      content: [
        { tag: "mtext", content: "A" },
        { tag: "mtext", content: "2" },
      ],
    } satisfies XmlNode);
  });

  it("sub", () => {
    expect(
      mathScripted(
        [
          { type: "text", text: "B" },
          { type: "text", text: "n", pos: "RB" },
        ],
        create
      )
    ).toEqual({
      tag: "msub",
      content: [
        { tag: "mtext", content: "B" },
        { tag: "mtext", content: "n" },
      ],
    } satisfies XmlNode);
  });

  it("all", () => {
    expect(
      mathScripted(
        [
          { type: "text", text: "U" },
          { type: "text", text: "235", pos: "LT" },
          { type: "text", text: "92", pos: "LB" },
          { type: "text", text: "3+", pos: "RT" },
          { type: "text", text: "2", pos: "RB" },
        ],
        create
      )
    ).toEqual({
      tag: "mmultiscripts",
      content: [
        { tag: "mtext", content: "U" },
        { tag: "mtext", content: "2" },
        { tag: "mtext", content: "3+" },
        { tag: "mprescripts" },
        { tag: "mtext", content: "92" },
        { tag: "mtext", content: "235" },
      ],
    } satisfies XmlNode);
  });

  it("left only", () => {
    expect(
      mathScripted(
        [
          { type: "text", text: "U" },
          { type: "text", text: "235", pos: "LT" },
          { type: "text", text: "92", pos: "LB" },
        ],
        create
      )
    ).toEqual({
      tag: "mmultiscripts",
      content: [
        { tag: "mtext", content: "U" },
        { tag: "mrow" },
        { tag: "mrow" },
        { tag: "mprescripts" },
        { tag: "mtext", content: "92" },
        { tag: "mtext", content: "235" },
      ],
    } satisfies XmlNode);
  });

  it("right only", () => {
    expect(
      mathScripted(
        [
          { type: "text", text: "U" },
          { type: "text", text: "3+", pos: "RT" },
          { type: "text", text: "2", pos: "RB" },
        ],
        create
      )
    ).toEqual({
      tag: "msubsup",
      content: [
        { tag: "mtext", content: "U" },
        { tag: "mtext", content: "2" },
        { tag: "mtext", content: "3+" },
      ],
    } satisfies XmlNode);
  });
});
