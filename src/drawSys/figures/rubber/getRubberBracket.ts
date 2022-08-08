import { closeBracket } from "./closeBracket";
import { openBracket } from "./openBracket";
import { openSquareBracket, closeSquareBracket } from "./squareBrackets";
import { RubberFigure } from "./RubberFigure";
import { closeBrace, openBrace } from "./braces";

const dict: Record<string, RubberFigure> = {
  "[": openSquareBracket,
  "]": closeSquareBracket,
  "(": openBracket,
  ")": closeBracket,
  "{": openBrace,
  "}": closeBrace,
};

export const getRubberBracket = (
  isOpen: boolean,
  text: string
): RubberFigure => {
  const rubberFig = dict[text];
  if (rubberFig) return rubberFig;
  return isOpen ? openSquareBracket : closeSquareBracket;
};
