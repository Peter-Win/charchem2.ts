import { escapeXml } from "../xml/escapeXml";
import { TextChunk } from "./TextChunk";
import { TextFormat } from "./TextFormat";
import { TextStyle } from "./TextStyle";
import { drawChunk } from "./drawChunk";
import { optimizeChunks } from "./optimizeChunks";

const simpleTag = (name: string, closed: boolean): string =>
  `<${closed ? "/" : ""}${name}>`;

export const textFormatHtml: TextFormat = {
  optimize: (chunks: TextChunk[]): TextChunk[] => optimizeChunks(chunks),
  chunkToText(chunk: TextChunk): string {
    return drawChunk(chunk, this);
  },
  styleToText: (style: TextStyle, mode: "open" | "close"): string =>
    simpleTag(style.tag, mode === "close"),
  escape: (text: string): string => escapeXml(text),
};
