import { ChemBracketBegin, getBracketsContent } from "./ChemBracket";
import { ChemObj } from "./ChemObj";
import { isTextFormula } from "../inspectors/isTextFormula";

/**
 * Если внутри скобок все элементы текстовые,
 * например Ca(OH)2 или даже K3[Fe(CN)6]
 * то для вывода скобок гораздо лучше использовать текущий шрифт.
 * @param begin
 * @param commands
 */
export const isTextBrackets = (
  begin: ChemBracketBegin,
  commands: ChemObj[]
): boolean =>
  !getBracketsContent(begin, commands).find((cmd) => !isTextFormula(cmd));

export const isTextBracketsCached = (
  begin: ChemBracketBegin,
  commands: ChemObj[]
): boolean => {
  if (begin.isText !== undefined) {
    return begin.isText;
  }
  const result = isTextBrackets(begin, commands);
  // eslint-disable-next-line no-param-reassign
  begin.isText = result;
  return result;
};
