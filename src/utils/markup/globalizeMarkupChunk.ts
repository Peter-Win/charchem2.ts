import { MarkupChunk, MarkupProps } from "./markup";

export const globalizeMarkupChunk = (
  chunk: MarkupChunk,
  ownerProps: MarkupProps,
): MarkupChunk => {
  const props = { ...ownerProps, ...chunk.props };
  return {
    props,
    chunks: chunk.chunks.map((item) =>
      typeof item === "string" ? item : globalizeMarkupChunk(item, props),
    ),
  };
};
