import { globalizeMarkupChunk } from "../globalizeMarkupChunk";
import { MarkupChunk } from "../markup";

test("globalizeMarkupChunk", () => {
  const mc: MarkupChunk = {
    props: {
      italic: true,
    },
    chunks: [
      "text",
      {
        props: { bold: true },
        chunks: ["bold"],
      },
    ],
  };
  expect(globalizeMarkupChunk(mc, {})).toEqual({
    props: { italic: true },
    chunks: [
      "text",
      {
        props: {
          bold: true,
          italic: true,
        },
        chunks: ["bold"],
      },
    ],
  } satisfies MarkupChunk);
});
