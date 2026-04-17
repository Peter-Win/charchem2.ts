import { splitRichText } from "../splitRichText";
import { TextNode } from "../TextNode";

describe("splitRichText", () => {
  it("simple text", () => {
    expect(splitRichText("Hello!", "black", true)).toEqual({
      type: "richText",
      src: "Hello!",
      color: "black",
      props: {},
      items: [
        {
          type: "text",
          text: "Hello!",
          color: "black",
        },
      ],
    } satisfies TextNode);
  });

  it("use sup", () => {
    const color = "#111";
    expect(splitRichText("R^{ABC}", color)).toEqual({
      type: "richText",
      color,
      props: {},
      items: [
        {
          type: "richText",
          color,
          props: {},
          items: [
            { type: "text", text: "R", color },
            {
              type: "richText",
              pos: "RT",
              color,
              props: {},
              items: [{ type: "text", text: "ABC", color }],
            },
          ],
        },
      ],
    } satisfies TextNode);
  });

  it("different colors", () => {
    // console.log(">>", JSON.stringify(splitRichText("AB{\\color{red}CD}EF", "#001"), null, "  "));
    expect(splitRichText("AB{\\color{red}CD}EF", "#001")).toEqual({
      type: "richText",
      color: "#001",
      props: {},
      items: [
        { type: "text", text: "AB", color: "#001" },
        {
          type: "richText",
          color: "red",
          props: {},
          items: [
            {
              type: "text",
              color: "red", // наследуется для type="text"
              text: "CD",
            },
          ],
        },
        { type: "text", text: "EF", color: "#001" },
      ],
    } satisfies TextNode);
  });

  it("H2SO4", () => {
    const color = "black";
    expect(splitRichText("H_2SO_4", color)).toEqual({
      type: "richText",
      color,
      props: {},
      items: [
        {
          type: "richText",
          color,
          props: {},
          items: [
            { type: "text", text: "H", color },
            {
              type: "richText",
              color,
              props: {},
              pos: "RB",
              items: [{ type: "text", text: "2", color }],
            },
          ],
        },
        {
          type: "richText",
          color,
          props: {},
          items: [
            { type: "text", text: "SO", color },
            {
              type: "richText",
              color,
              pos: "RB",
              props: {},
              items: [{ type: "text", text: "4", color }],
            },
          ],
        },
      ],
    } satisfies TextNode);
  });

  it("split italic text", () => {
    const color = "black";
    expect(splitRichText("a\\textit{b}c", color)).toEqual({
      type: "richText",
      color,
      props: {},
      items: [
        { type: "text", text: "a", color },
        {
          type: "richText",
          color,
          props: { italic: true },
          items: [{ type: "text", text: "b", color }],
        },
        { type: "text", text: "c", color },
      ],
    } satisfies TextNode);
  });

  it("split font change", () => {
    const color = "black";
    expect(splitRichText("A\\small{B}C", color)).toEqual({
      type: "richText",
      color,
      props: {},
      items: [
        { type: "text", text: "A", color },
        {
          type: "richText",
          color,
          props: { fontSizePt: 9 },
          items: [{ type: "text", text: "B", color }],
        },
        { type: "text", text: "C", color },
      ],
    } satisfies TextNode);
  });
});
