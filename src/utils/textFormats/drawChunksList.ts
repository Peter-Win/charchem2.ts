import { TextChunk } from "./TextChunk";
import { TextFormat } from "./TextFormat";
import { drawChunk } from "./drawChunk";

export const drawChunksList = (
  chunks: TextChunk[],
  format: TextFormat
): string => {
  const optChunks = format.optimize(chunks);
  return optChunks.map((c) => drawChunk(c, format)).join("");
};
