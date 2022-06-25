import { Int } from "../../types";

// Определение границы параметра. Ограничителем является знак , или )
export const scanPar = (src: string, start: Int): Int => {
  // нужно учитывать баланс скобок и кавычек
  let lock = 0;
  let isComment = false;
  let pos = start;
  while (pos < src.length) {
    const c = src[pos];
    if (c === '"') isComment = !isComment;
    else if (c === "(" && !isComment) lock++;
    else if (c === "," && !isComment && lock === 0) break;
    else if (c === ")" && !isComment) {
      if (lock > 0) lock--;
      else break;
    }
    pos++;
  }
  return pos;
};
