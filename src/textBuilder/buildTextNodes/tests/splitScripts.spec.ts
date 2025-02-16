import { TextNode, TextPosition } from "../TextNode";
import { splitScripts } from "../splitScripts";

const n = (text: string, pos?: TextPosition): TextNode => {
  const res: TextNode = {
    type: "text",
    text,
  };
  if (pos) res.pos = pos;
  return res;
};

describe("splitScripts", () => {
  // 235 3+
  //    U
  //  92 2
  it("all cases", () => {
    const src: TextNode[] = [
      n("U"),
      n("3+", "RT"),
      n("2", "RB"),
      n("235", "LT"),
      n("92", "LB"),
    ];
    expect(splitScripts(src)).toEqual({
      C: [src[0]],
      RT: [src[1]],
      RB: [src[2]],
      LT: [src[3]],
      LB: [src[4]],
    });
  });
});
