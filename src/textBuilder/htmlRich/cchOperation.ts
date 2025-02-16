import { XmlAttrs } from "../../utils/xml/xmlTypes";
import { ChemOp } from "../../core/ChemOp";
import { TextNode } from "../buildTextNodes";
import { XmlNode } from "../xmlNode/XmlNode";
import { CtxHtmlRich } from "./createHtmlRichNodes";
import { HtmlRichClass } from "./HtmlRichClasses";
import { makeCchTag } from "./makeCchTag";

// .cch-op tag
export const cchOperation = (
  ctx: CtxHtmlRich,
  srcNode: TextNode,
  op: ChemOp
): XmlNode => {
  const arrow = cchArrowTag(ctx, srcNode, op);
  const cls: HtmlRichClass[] = ["op"];
  const arrows: XmlNode[] = [];
  if (arrow) {
    cls.push("op-arrow");
    arrows.push(arrow);
  }
  return makeCchTag({
    ctx,
    srcNode,
    cls,
    attrs: { "data-op": op.srcText },
    content: [
      ...arrows,
      makeCchTag({
        ctx,
        srcNode: undefined,
        cls: "op-code",
        content: op.dstText,
      }),
    ],
  });
};

const cchArrowTag = (
  ctx: CtxHtmlRich,
  srcNode: TextNode,
  op: ChemOp
): XmlNode | undefined => {
  const { srcText } = op;
  if (srcText === "-->" || srcText === "-->") {
    return longRightArrow(ctx);
  }
  if (srcText === "<--" || srcText === "<|--") {
    return longLeftArrow(ctx);
  }
  if (srcText === "<==>") {
    return makeCchTag({
      ctx,
      srcNode,
      cls: "arrow-both",
      content: [bothArrowsLeft(ctx), bothArrowsRight(ctx)],
    });
  }
  if (srcText === "<-->" || srcText === "<|--|>") {
    return makeCchTag({
      ctx,
      srcNode,
      cls: ["arrow-bidir"],
      content: [longLeftArrow(ctx), longRightArrow(ctx)],
    });
  }
  return undefined;
};

const figure = ({
  ctx,
  width,
  height,
  d,
  cls,
}: {
  ctx: CtxHtmlRich;
  width: number;
  height: number;
  d: string;
  cls: HtmlRichClass;
}): XmlNode => {
  const attrs: XmlAttrs = {
    width: `${width / 1000}em`,
    height: `${height / 1000}em`,
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMaxYMin slice",
    fill: "currentColor",
  };
  return makeCchTag({
    ctx,
    srcNode: undefined,
    cls,
    content: [
      {
        tag: "svg",
        attrs,
        content: [
          {
            tag: "path",
            attrs: { d },
          },
        ],
      },
    ],
  });
};

const longRightArrow = (ctx: CtxHtmlRich): XmlNode =>
  figure({
    ctx,
    cls: "arrow-fwd",
    width: 400000,
    height: 522,
    d: `M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
  11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
  39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
  151.7 139 205zm0 0v40h399900v-40z`,
  });

const longLeftArrow = (ctx: CtxHtmlRich): XmlNode =>
  figure({
    ctx,
    width: 400000,
    height: 522,
    cls: "arrow-bkwd",
    d: `M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,
  });

const bothArrowsLeft = (ctx: CtxHtmlRich): XmlNode =>
  figure({
    ctx,
    width: 400000,
    height: 901,
    cls: "arrow-both-left",
    d: `M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,
  });

const bothArrowsRight = (ctx: CtxHtmlRich): XmlNode =>
  figure({
    ctx,
    width: 400000,
    height: 901,
    cls: "arrow-both-right",
    d: `M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
  -27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
  13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
  -84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
  -119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
  -12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
  151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,
  });
