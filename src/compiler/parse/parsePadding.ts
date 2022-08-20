import { Int, Double } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "./parseNum";

export const parsePadding = (
  compiler: ChemCompiler,
  values: string,
  pos: Int
): Double[] => {
  const chunks = values.split(";");
  let curPos = 0;
  return chunks.map((val) => {
    const n = parseNum(compiler, val, curPos + pos);
    curPos += val.length + 1;
    return n;
  });
};
