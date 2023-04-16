import { drawChunksList } from "../drawChunksList";
import { textFormatHtml } from "../textFotmatHtml";

describe("drawChunksList", () => {
  it("two chunks", () => {
    expect(
      drawChunksList(
        [
          { text: "N", styles: [{ tag: "i" }] },
          { text: "3", styles: [{ tag: "sup" }] },
        ],
        textFormatHtml
      )
    ).toBe("<i>N</i><sup>3</sup>");
  });
});
