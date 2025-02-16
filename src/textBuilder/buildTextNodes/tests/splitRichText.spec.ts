import { splitRichText } from "../splitRichText";
import { TextNode } from "../TextNode";

describe("splitRichText", () => {
  it("simple text", () => {
    expect(splitRichText("Hello!", "black")).toEqual({
      type: "richText",
      color: "black",
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
      items: [
        {
          type: "richText",
          color,
          items: [
            { type: "text", text: "R", color },
            {
              type: "richText",
              pos: "RT",
              color,
              items: [{ type: "text", text: "ABC", color }],
            },
          ],
        },
      ],
    } satisfies TextNode);
  });
  it("different colors", () => {
    expect(splitRichText("AB{\\color{red}CD}EF", "#001")).toEqual({
      type: "richText",
      color: "#001",
      items: [
        { type: "text", text: "AB", color: "#001" },
        {
          type: "richText",
          color: "red",
          items: [
            {
              type: "text",
              color: "red",
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
      items: [
        {
          type: "richText",
          color,
          items: [
            { type: "text", text: "H", color },
            {
              type: "richText",
              color,
              pos: "RB",
              items: [{ type: "text", text: "2", color }],
            },
          ],
        },
        {
          type: "richText",
          color,
          items: [
            { type: "text", text: "SO", color },
            {
              type: "richText",
              color,
              pos: "RB",
              items: [{ type: "text", text: "4", color }],
            },
          ],
        },
      ],
    } satisfies TextNode);
  });
});
