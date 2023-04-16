import { TextChunk } from "./TextChunk";
import { TextFormat } from "./TextFormat";

export const drawChunk = (
  chunk: TextChunk,
  format: Pick<TextFormat, "escape" | "styleToText">
): string => {
  const pieces: string[] = [];
  const styles = [...(chunk.styles || [])];
  styles.forEach((style) => {
    if (!style.mode || style.mode === "open") {
      pieces.push(format.styleToText(style, "open"));
    }
  });
  pieces.push(format.escape(chunk.text));
  styles.reverse();
  styles.forEach((style) => {
    if (!style.mode || style.mode === "close") {
      pieces.push(format.styleToText(style, "close"));
    }
  });
  return pieces.join("");
};
