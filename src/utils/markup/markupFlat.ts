import { MarkupChunk } from "./markup";

export interface ParamsMarkupFlat {
  phase: "open" | "close" | "full";
  chunk: MarkupChunk | string;
  owner: MarkupChunk;
}
export const markupFlat = (
  m: MarkupChunk,
  onChunk: (params: ParamsMarkupFlat) => void
): void => {
  m.chunks.forEach((chunk) => {
    if (typeof chunk === "string") {
      onChunk({ phase: "full", chunk, owner: m });
    } else {
      onChunk({ phase: "open", chunk, owner: m });
      markupFlat(chunk, onChunk);
      onChunk({ phase: "close", chunk, owner: m });
    }
  });
};
