import { Char, Double, Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { isDigit } from "../parse/isDigit";
import { createCommonBond, onOpenBond } from "./bondCommon";
import { createPolygonStep } from "./bondUniversal";
import { scanBondSuffix } from "../parse/scanBondSuffix";

export const createPolygonalBond = (compiler: ChemCompiler) => {
  const beginPos = compiler.pos - 1;
  const mode: Char = compiler.curChar();
  let multiplicity = 1;
  let sign: Int = 0;
  if (mode === "p") sign = 1;
  else if (mode === "q") sign = -1;
  if (!sign) {
    // Эта ошибка не может возникнуть из-за ошибки пользователя. Только если ошибка в компиляторе.
    compiler.error("Invalid polygonal bond descriptor [c]", { c: mode });
  }
  compiler.pos++;
  // Далее возможен повторный символ, который означает двойную связь
  if (compiler.curChar() === mode) {
    multiplicity++;
    compiler.pos++;
  }
  // Далее возможно указание количество углов полигона (Если не указано, то 5)
  let strCount = "";
  while (isDigit(compiler.curChar())) {
    strCount += compiler.curChar();
    compiler.pos++;
  }
  const count: Int = +strCount || 0;

  const bond = createCommonBond(compiler);
  bond.n = multiplicity as Double;
  bond.dir = createPolygonStep(
    compiler,
    sign * (count || 5),
    compiler.varLength
  );

  scanBondSuffix(compiler, bond);
  bond.tx = compiler.subStr(beginPos);

  onOpenBond(compiler, bond, beginPos);
};
