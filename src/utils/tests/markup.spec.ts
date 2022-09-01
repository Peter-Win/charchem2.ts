import {
  MarkupChunkType,
  markupFlat,
  ParamsMarkupFlat,
  parseMarkup,
  scanMarkupEnd,
} from "../markup";
import { drawTag } from "../xml/drawTag";
import { escapeXml } from "../xml/escapeXml";
import { XmlAttrs } from "../xml/xmlTypes";

it("scanMarkupEnd", () => {
  expect(scanMarkupEnd("", 0, "}")).toBe(0);
  expect(scanMarkupEnd("{}...", 1, "}")).toBe(2);
  //                    0 123456789012
  expect(scanMarkupEnd("{\\color{red}}...", 1, "}")).toBe(13);
  //                    012345678901
  expect(scanMarkupEnd("{x^{A_{21}}}...", 1, "}")).toBe(12);
});

describe("parseMarkup", () => {
  it("simple text", () => {
    const c = parseMarkup("text");
    expect(c).toEqual({ type: "", chunks: ["text"] });
  });
  it("single superchar", () => {
    const c = parseMarkup("(a^2 + b^3)");
    expect(c.chunks).toEqual([
      "(a",
      { type: "sup", chunks: ["2"] },
      " + b",
      { type: "sup", chunks: ["3"] },
      ")",
    ]);
  });
  it("single subchars", () => {
    const c = parseMarkup("A_i + B_j");
    expect(c.chunks).toEqual([
      "A",
      { type: "sub", chunks: ["i"] },
      " + B",
      { type: "sub", chunks: ["j"] },
    ]);
  });
  it("super and sub multichars", () => {
    const c = parseMarkup("X_{21}^{n+1}");
    expect(c.chunks).toEqual([
      "X",
      { type: "sub", chunks: ["21"] },
      { type: "sup", chunks: ["n+1"] },
    ]);
  });
  it("nested markup", () => {
    const c = parseMarkup("T^{a_{00}}");
    expect(c.chunks).toEqual([
      "T",
      { type: "sup", chunks: ["a", { type: "sub", chunks: ["00"] }] },
    ]);
  });
  it("unlimited color", () => {
    const c = parseMarkup("first, \\color{red}second, \\color{green}third");
    expect(c.chunks).toEqual([
      "first, ",
      { type: "", color: "red", chunks: ["second, "] },
      { type: "", color: "green", chunks: ["third"] },
    ]);
  });
  it("limited color", () => {
    const c = parseMarkup("A, {\\color{red}B,} C, {\\color{rgb(255,0,0)}D,} E");
    expect(c.chunks).toEqual([
      "A, ",
      { type: "", color: "red", chunks: ["B,"] },
      " C, ",
      { type: "", color: "rgb(255,0,0)", chunks: ["D,"] },
      " E",
    ]);
  });
});

describe("markupFlat", () => {
  const mkTag = (type: MarkupChunkType): string => type || "span";
  const toHtml = (src: string): string => {
    const m = parseMarkup(src);
    let result = "";
    let prevColor: string | undefined;
    markupFlat(m, ({ phase, chunk }: ParamsMarkupFlat) => {
      if (typeof chunk === "string") result += escapeXml(chunk);
      else if (phase === "full" && typeof chunk.chunks[0] === "string") {
        result += escapeXml(chunk.chunks[0]);
      } else if (phase === "open") {
        const attrs: XmlAttrs = {};
        const { color } = chunk;
        if (prevColor !== color) {
          if (color) attrs.style = `color: ${chunk.color}`;
          prevColor = color;
        }
        result += drawTag(mkTag(chunk.type), attrs);
      } else if (phase === "close") {
        result += `</${mkTag(chunk.type)}>`;
      }
    });
    return result;
  };
  it("simple text", () => {
    expect(toHtml("Hello, world!")).toBe("Hello, world!");
  });
  it("sub- and super-script", () => {
    expect(toHtml("A_{11}^2 + B_{12}^3")).toBe(
      "A<sub>11</sub><sup>2</sup> + B<sub>12</sub><sup>3</sup>"
    );
  });
  it("color", () => {
    expect(toHtml("A, \\color{red}B.")).toBe(
      `A, <span style="color: red">B.</span>`
    );
    expect(toHtml("A, {\\color{green}Green}, C")).toBe(
      `A, <span style="color: green">Green</span>, C`
    );
  });
});
