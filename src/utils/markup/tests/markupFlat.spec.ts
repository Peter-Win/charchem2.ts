import { MarkupChunk, MarkupChunkType } from "../markup";
import { parseMarkupChunk } from "../parseMarkup";
import { markupFlat, ParamsMarkupFlat } from "../markupFlat";
import { drawTag } from "../../xml/drawTag";
import { escapeXml } from "../../xml/escapeXml";
import { XmlAttrs } from "../../xml/xmlTypes";

describe("markupFlat", () => {
  const mkTag = (type: MarkupChunkType | undefined): string => type || "span";
  const toHtml = (src: string): string => {
    const m: MarkupChunk = parseMarkupChunk(src);
    let result = "";
    let prevColor: string | undefined;
    markupFlat(m, ({ phase, chunk }: ParamsMarkupFlat) => {
      if (typeof chunk === "string") result += escapeXml(chunk);
      else if (phase === "full" && typeof chunk.chunks[0] === "string") {
        result += escapeXml(chunk.chunks[0]);
      } else if (phase === "open") {
        const attrs: XmlAttrs = {};
        const { color } = chunk.props ?? {};
        if (prevColor !== color) {
          if (color) attrs.style = `color: ${color}`;
          prevColor = color;
        }
        result += drawTag(mkTag(chunk.props?.type), attrs);
      } else if (phase === "close") {
        result += `</${mkTag(chunk.props?.type)}>`;
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
