import { MarkupChunk, parseMarkup } from "../../utils/markup";
import { TextNode } from "./TextNode";

export const splitRichText = (
  srcText: string,
  textColor: string | undefined,
  needSrc?: boolean
): TextNode => {
  const onChunk = (
    chunk: MarkupChunk | string,
    color: string | undefined
  ): TextNode => {
    if (typeof chunk === "string") {
      return { type: "text", text: chunk, color };
    }
    const locColor = chunk.color ?? color;
    const res: TextNode = {
      type: "richText",
      items: chunk.chunks.map((c) => onChunk(c, locColor)),
      color: locColor,
    };
    if (needSrc) {
      res.src = srcText;
    }
    if (chunk.type === "sub") {
      res.pos = "RB";
    } else if (chunk.type === "sup") {
      res.pos = "RT";
    }
    return res;
  };
  return onChunk(groupScripted(parseMarkup(srcText)), textColor);
};

/**
 * H2SO4 -> <rt>
 *   <text>H</text>
 *   <rt pos=RB><text>2</text></rt>
 *
 *   <text>S</text>
 *
 *   <text>O</text>
 *   <rt pos=RB><text>4</text>
 * </rt>
 *                ==>
 * <rt>
 *   <rt>
 *     <text>H</text>
 *     <rt pos=RB><text>2</text></rt>
 *   </rt>
 *   <text>S</text>
 *   <rt>
 *     <text>O</text>
 *     <rt pos=RB><text>4</text></rt>
 *   </rt>
 * </rt>
 * Такая структура позволяет получить группы с индексами. н.р. <msub><mi>H</mi><mn>2</mn></msub>
 * @param chunk
 */
const groupScripted = (chunk: MarkupChunk): MarkupChunk => {
  const { chunks: ungrouped } = chunk;
  const grouped: (MarkupChunk | string)[][] | [(MarkupChunk | string)[]] = [[]];
  ungrouped.forEach((subChunk) => {
    if (
      typeof subChunk === "string" ||
      (subChunk.type !== "sub" && subChunk.type !== "sup")
    ) {
      grouped.unshift([]);
    }
    grouped[0].push(subChunk);
  });
  grouped.reverse();
  const optimized: (MarkupChunk | string)[] = grouped
    .filter((group) => group.length > 0)
    .map((group) => {
      if (group.length === 1) return group[0]!;
      return {
        type: "",
        chunks: group,
      };
    });
  return { ...chunk, chunks: optimized };
};
