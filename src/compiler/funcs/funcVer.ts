import { getVersion } from "../../getVersion";
import { Int } from "../../types";
import { ifDef } from "../../utils/ifDef";
import { ChemCompiler } from "../ChemCompiler";

const toIntOrZero = (s: string = ""): Int => +s || 0;

// Эта функция должна обеспечивть совместимость с предыдущими версиями
// Возможно передать в одном параметре оба номера через точку 1.1
// Но можно и через запятую. Тогда это два параметра
export const parseVerParameter = (args: string[]): [Int, Int] => {
  const [a, b] = args;
  const verStr: string =
    ifDef(a, (v1) => ifDef(b, (v2) => `${v1}.${v2}`) ?? a) ?? b ?? "0.0";
  const verList = verStr.split(".");
  const verList2 = [
    verList.length === 0 ? "0" : verList[0]!,
    verList.length < 2 ? "0" : verList[1]!,
  ];
  return [toIntOrZero(verList2[0]), toIntOrZero(verList2[1])];
};

export const funcVer = (
  compiler: ChemCompiler,
  args: string[]
  // @Suppress("UNUSED_PARAMETER") pos: List<Int>,
) => {
  const [high, low] = parseVerParameter(args);
  const currentVersion = getVersion();
  if (
    high > currentVersion[0]! ||
    (high === currentVersion[0] && low > currentVersion[1]!)
  ) {
    compiler.error("Invalid version", {
      cur: `${currentVersion[0]}.${currentVersion[1]}`,
      need: `${high}.${low}`,
    });
  }
};
