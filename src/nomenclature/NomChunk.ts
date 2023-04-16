/**
 * Названия состоят из чанков.
 * Потому что названия содержат разметку. Это влияет на:
 * - нужно уметь экспортировать разметку в разные системы (html, TeX, ...)
 * - некоторые правила (н.р. сортировка локантов) должны учитывать разметку
 */

import { TextStyle } from "../utils/textFormats/TextStyle";
import { TextChunk } from "../utils/textFormats/TextChunk";

export type NomChunkMarkup = "super" | "sub" | "italic";

export interface NomChunk {
  text: string;
  markup?: NomChunkMarkup;
}

const markupToTag: Record<NomChunkMarkup, TextStyle[]> = {
  super: [{ tag: "sup" }],
  sub: [{ tag: "sub" }],
  italic: [{ tag: "i" }],
};

export const nomToTextChunk = ({ text, markup }: NomChunk): TextChunk => ({
  text,
  styles: markup && markupToTag[markup],
});
