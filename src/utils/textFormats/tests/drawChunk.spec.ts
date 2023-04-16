import { TextStyle } from "../TextStyle";
import { drawChunk } from "../drawChunk";

test("drawChunk", () => {
  const htmlLite = {
    escape: (s: string) => s,
    styleToText: (style: TextStyle, mode: "open" | "close") =>
      `<${mode === "close" ? "/" : ""}${style.tag}>`,
  };
  expect(
    drawChunk(
      {
        styles: [{ tag: "i" }],
        text: "Hello",
      },
      htmlLite
    )
  ).toBe("<i>Hello</i>");
  expect(
    drawChunk(
      {
        styles: [{ tag: "b" }, { tag: "i" }],
        text: "Test",
      },
      htmlLite
    )
  ).toBe("<b><i>Test</i></b>");
});
