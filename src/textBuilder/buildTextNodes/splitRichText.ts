import { MarkupChunk, MarkupChunkItem, parseMarkup } from "../../utils/markup";
import { TextNode } from "./TextNode";

export const splitRichText = (
  srcText: string,
  textColor: string | undefined,
  needSrc?: boolean,
): TextNode => {
  const onChunk = (
    chunk: MarkupChunk | string,
    superColor: string | undefined,
  ): TextNode => {
    if (typeof chunk === "string") {
      return {
        type: "text",
        text: chunk,
        color: superColor,
      };
    }
    // const { color, type: chunkType, chunks, ...props } = chunk;
    const { chunks, props: srcProps } = chunk;
    const { color, type: chunkType, ...props } = srcProps ?? {};
    const locColor = color ?? superColor;
    const res: TextNode = {
      type: "richText",
      items: chunks.map((c) => onChunk(c, locColor)),
      color: locColor,
      props,
    };
    if (needSrc) {
      res.src = srcText;
    }
    if (chunkType === "sub") {
      res.pos = "RB";
    } else if (chunkType === "sup") {
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
const groupScripted = (ungrouped: MarkupChunkItem[]): MarkupChunk => {
  const grouped: (MarkupChunk | string)[][] | [(MarkupChunk | string)[]] = [[]];
  ungrouped.forEach((subChunk) => {
    if (typeof subChunk === "string" || !subChunk.props?.type) {
      grouped.unshift([]);
    }
    grouped[0].push(subChunk);
  });
  grouped.reverse();
  const optimized: MarkupChunkItem[] = grouped
    .filter((group) => group.length > 0)
    .map((group) => {
      if (group.length === 1) return group[0]!;
      return {
        chunks: group,
      };
    });
  return { ...ungrouped, chunks: optimized };
};
