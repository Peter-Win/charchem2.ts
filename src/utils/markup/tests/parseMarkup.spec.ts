import { MarkupChunk, MarkupChunkItem } from "../markup";
import { parseMarkup } from "../parseMarkup";

describe("parseMarkup", () => {
  it("simple text", () => {
    const c = parseMarkup("text");
    expect(c).toEqual(["text"] satisfies MarkupChunkItem[]);
  });

  it("single superchar", () => {
    const c = parseMarkup("(a^2 + b^3)");
    expect(c).toEqual([
      "(a",
      { chunks: ["2"], props: { type: "sup" } },
      " + b",
      { chunks: ["3"], props: { type: "sup" } },
      ")",
    ] satisfies MarkupChunkItem[]);
  });

  it("single subchars", () => {
    const c = parseMarkup("A_i + B_j");
    expect(c).toEqual([
      "A",
      { props: { type: "sub" }, chunks: ["i"] },
      " + B",
      { props: { type: "sub" }, chunks: ["j"] },
    ] satisfies MarkupChunkItem[]);
  });

  it("super and sub multichars", () => {
    const c = parseMarkup("X_{21}^{n+1}");
    expect(c).toEqual([
      "X",
      { props: { type: "sub" }, chunks: ["21"] },
      { props: { type: "sup" }, chunks: ["n+1"] },
    ] satisfies MarkupChunkItem[]);
  });

  it("nested markup", () => {
    const c = parseMarkup("T^{a_{00}}");
    expect(c).toEqual([
      "T",
      {
        props: { type: "sup" },
        chunks: ["a", { props: { type: "sub" }, chunks: ["00"] }],
      },
    ] satisfies MarkupChunkItem[]);
  });

  it("unlimited color", () => {
    const c = parseMarkup("first, \\color{red}second, \\color{green}third");
    expect(c).toEqual([
      "first, ",
      { props: { color: "red" }, chunks: ["second, "] },
      { props: { color: "green" }, chunks: ["third"] },
    ] satisfies MarkupChunkItem[]);
  });

  it("limited color", () => {
    const c = parseMarkup("A, {\\color{red}B,} C, {\\color{rgb(255,0,0)}D,} E");
    expect(c).toEqual([
      "A, ",
      { props: { color: "red" }, chunks: ["B,"] },
      " C, ",
      { props: { color: "rgb(255,0,0)" }, chunks: ["D,"] },
      " E",
    ] satisfies MarkupChunkItem[]);
  });

  it("fontsize", () => {
    const c = parseMarkup("AAA {\\fontsize{8}Small} BBB");
    expect(c).toEqual([
      "AAA ",
      { props: { fontSizePt: 8 }, chunks: ["Small"] },
      " BBB",
    ] satisfies MarkupChunkItem[]);
  });

  it("named font size", () => {
    const c = parseMarkup("A\\large{M}Z");
    expect(c).toEqual([
      "A",
      { props: { fontSizePt: 12 }, chunks: ["M"] },
      "Z",
    ] satisfies MarkupChunkItem[]);
  });

  it("named font size alt", () => {
    const c = parseMarkup("left{\\small -middle-}right");
    expect(c).toEqual([
      "left",
      { props: { fontSizePt: 9 }, chunks: ["-middle-"] },
      "right",
    ] satisfies MarkupChunkItem[]);
  });

  it("bold", () => {
    const c = parseMarkup("norm|\\textbf{bold}");
    expect(c).toEqual([
      "norm|",
      { props: { bold: true }, chunks: ["bold"] },
    ] satisfies MarkupChunkItem[]);
  });

  it("bold alt", () => {
    const c = parseMarkup("norm|{\\textbf bold}");
    expect(c).toEqual([
      "norm|",
      { props: { bold: true }, chunks: ["bold"] },
    ] satisfies MarkupChunkItem[]);
  });

  it("italic", () => {
    const c = parseMarkup("norm|\\textit{italic}");
    expect(c).toEqual([
      "norm|",
      { props: { italic: true }, chunks: ["italic"] },
    ] satisfies MarkupChunkItem[]);
  });

  it("italic alt", () => {
    const c = parseMarkup("norm|{\\textit italic}");
    expect(c).toEqual([
      "norm|",
      { props: { italic: true }, chunks: ["italic"] },
    ] satisfies MarkupChunkItem[]);
  });

  it("underline", () => {
    const c = parseMarkup("Ab\\underline{Cd}Ef");
    expect(c).toEqual([
      "Ab",
      { props: { underline: true }, chunks: ["Cd"] },
      "Ef",
    ] satisfies MarkupChunkItem[]);
  });
  it("underline alt", () => {
    const c = parseMarkup("Ab{\\underline Cd}Ef");
    expect(c).toEqual([
      "Ab",
      { props: { underline: true }, chunks: ["Cd"] },
      "Ef",
    ] satisfies MarkupChunkItem[]);
  });

  it("overline", () => {
    const c = parseMarkup("Aa\\overline{Bb}Cc");
    expect(c).toEqual([
      "Aa",
      { props: { overline: true }, chunks: ["Bb"] },
      "Cc",
    ] satisfies MarkupChunk["chunks"]);
  });
  it("overline alt", () => {
    const c = parseMarkup("Xx{\\overline Yy} Zz");
    expect(c).toEqual([
      "Xx",
      { props: { overline: true }, chunks: ["Yy"] },
      " Zz",
    ] satisfies MarkupChunk["chunks"]);
  });

  it("nested styles", () => {
    const c = parseMarkup("\\underline{abc\\Large{de}f}");
    // свойства не передаются от вышележащих к подчинённым
    expect(c).toEqual([
      {
        props: { underline: true },
        chunks: [
          "abc",
          {
            props: { fontSizePt: 14.4 },
            chunks: ["de"],
          },
          "f",
        ],
      },
    ] satisfies MarkupChunkItem[]);
  });

  it("color to end of block", () => {
    // Цвет должен передаваться всем последующим элементам до конца блока
    const c = parseMarkup(`A\\color{red}B\\large{C}`);
    expect(c).toEqual([
      "A",
      {
        props: { color: "red" },
        chunks: ["B"],
      },
      {
        props: {
          fontSizePt: 12,
          color: "red", // Цвет должен применяться ко всем элементам до конца чанка
        },
        chunks: ["C"],
      },
    ] satisfies MarkupChunkItem[]);
  });
});
