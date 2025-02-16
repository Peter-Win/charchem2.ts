import { TextNode } from "../TextNode";
import { splitColumn } from "../splitColumn";

describe("splitColumn", () => {
  it("all types", () => {
    //    top
    //    Cu₂
    //   bottom
    const nodes: TextNode[] = [
      { type: "text", text: "Cu" },
      { type: "text", text: "2", pos: "RB" },
      { type: "text", text: "top", pos: "T" },
      { type: "text", text: "bottom", pos: "B" },
    ];
    expect(splitColumn(nodes)).toEqual({
      C: [
        { type: "text", text: "Cu" },
        { type: "text", text: "2", pos: "RB" },
      ],
      T: [{ type: "text", text: "top", pos: "T" }],
      B: [{ type: "text", text: "bottom", pos: "B" }],
    } satisfies ReturnType<typeof splitColumn>);
  });
});
