import { ChemExpr } from "../core/ChemExpr";
import { compile } from "../compiler/compile";
import { ChemObj } from "../core/ChemObj";
import { makeElemList } from "./makeElemList";
import { isAbstractCoeffs } from "./isAbstract";

export const makeBruttoKey = (src: ChemObj | string): string => {
  let obj: ChemObj;
  if (typeof src === "string") {
    const expr = compile(src);
    if (!expr.isOk()) return "";
    obj = expr;
  } else {
    if (src instanceof ChemExpr && !src.isOk()) {
      return "";
    }
    obj = src;
  }
  // Если в формуле есть абстрактные элементы, это приемлемо.
  // Но если есть абстрактные коэффициенты, тогда вычислить нельзя.
  if (isAbstractCoeffs(obj)) return "";

  const elemList = makeElemList(obj);
  elemList.sortByHill();
  return String(elemList);
};
