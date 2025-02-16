import { optimizeXmlColors } from "../optimizeXmlColors";
import { XmlNode } from "../XmlNode";

describe("optimizeXmlColors", () => {
  it("All nodes with same color", () => {
    const color = "black";
    const root: XmlNode = {
      tag: "top",
      color,
      content: [
        {
          tag: "mid",
          color,
          content: [
            { tag: "lo", color, content: "A" },
            { tag: "lo", color: "red", content: "B" },
            { tag: "lo", color, content: "C" },
          ],
        },
      ],
    };
    optimizeXmlColors(root);
    expect(root).toEqual({
      tag: "top",
      color,
      content: [
        {
          tag: "mid",
          content: [
            { tag: "lo", content: "A" },
            { tag: "lo", color: "red", content: "B" },
            { tag: "lo", content: "C" },
          ],
        },
      ],
    });
  });
});
