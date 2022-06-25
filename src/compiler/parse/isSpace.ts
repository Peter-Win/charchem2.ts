import { Char } from "../../types";

export const isSpace = (ch: Char): boolean =>
  ch === " " || ch === "\t" || ch === "\n";
