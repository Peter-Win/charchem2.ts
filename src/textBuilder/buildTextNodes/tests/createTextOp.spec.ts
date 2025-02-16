import { ChemComment } from "../../../core/ChemComment";
import { ChemOp } from "../../../core/ChemOp";
import { createTextOp } from "../createTextOp";
import { TextNode } from "../TextNode";

describe("createTextOp", () => {
  it("simple operation", () => {
    const simpleOp = new ChemOp("+", "+", false);
    expect(createTextOp(simpleOp)).toEqual({
      type: "op",
      op: simpleOp,
    } satisfies TextNode);
  });
  it("operation with over", () => {
    const op = new ChemOp("->", "→", true);
    op.color = "#200";
    op.commentPre = new ChemComment("over");
    expect(createTextOp(op)).toEqual({
      type: "column",
      columnType: "op",
      color: "#200",
      items: [
        {
          type: "op",
          op,
          color: "#200",
        },
        {
          type: "richText",
          color: "#200",
          pos: "T",
          items: [
            {
              type: "text",
              text: "over",
              color: "#200",
            },
          ],
        },
      ],
    } satisfies TextNode);
  });
});
