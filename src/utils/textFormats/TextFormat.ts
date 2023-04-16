import { TextChunk } from "./TextChunk";
import { TextStyle } from "./TextStyle";

export interface TextFormat {
  optimize(chunks: TextChunk[]): TextChunk[];
  chunkToText(chunk: TextChunk): string;
  styleToText(style: TextStyle, mode: "open" | "close"): string;
  escape(text: string): string;
}
