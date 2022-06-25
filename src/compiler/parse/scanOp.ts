import { ChemCompiler } from "../ChemCompiler";
import { OpDef, opsList } from "../main/chemOp";
import { isSpace } from "./isSpace";

export const scanOp = (compiler: ChemCompiler): OpDef | undefined => {
  const res = opsList.find((it) => compiler.isCurPosEq(it.src));
  if (res) {
    const nextPos = compiler.pos + res.src.length;
    const nextChar = compiler.text[nextPos];
    if (nextChar && !isSpace(nextChar) && nextChar !== '"') {
      // it is not operation. For example =|`=`|
      return undefined;
    }
    compiler.pos += res.src.length;
  }
  return res;
};
