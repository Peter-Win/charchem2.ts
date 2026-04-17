export type MarkupChunkType = "sub" | "sup";

export type MarkupProps = {
  type?: MarkupChunkType;
  color?: string;
  fontSizePt?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  overline?: boolean;
};

export type MarkupChunk = {
  chunks: MarkupChunkItem[];
  props?: MarkupProps;
};

export type MarkupChunkItem = MarkupChunk | string;
