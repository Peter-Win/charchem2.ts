import { Double, Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";

const numConstDict: Record<string, Double> = {
  $32: Math.sqrt(3.0) / 2.0,
  $3: Math.sqrt(3.0),
  $3x2: Math.sqrt(3.0) * 2,
  $2: Math.sqrt(2.0),
  $22: Math.sqrt(2.0) / 2.0,
  $2x2: Math.sqrt(2.0) * 2,
  "½": 0.5,
  "¼": 1.0 / 4.0,
  "¾": 3.0 / 4,
  "⅓": 1.0 / 3,
  "⅔": 2.0 / 3,
};

const invalidNumber = (
  compiler: ChemCompiler,
  value: string,
  pos: Int
): never => {
  compiler.error("Invalid number [n]", { n: value, pos });
};

const parseNumConst = (
  compiler: ChemCompiler,
  value: string,
  pos: Int
): Double => numConstDict[value] ?? invalidNumber(compiler, value, pos);

const useVariable = (compiler: ChemCompiler, name: string, pos: Int): Double =>
  compiler.varsDict[name] ??
  compiler.error("Undefined variable [name]", { name, pos });

const declareVariable = (
  compiler: ChemCompiler,
  name: string,
  value: string,
  pos: Int
): Double => {
  if (!name) {
    compiler.error("Expected variable name", { pos });
  }
  const v = +value;
  const n: Double = Number.isNaN(v)
    ? parseNumConst(compiler, value, pos + name.length + 1)
    : v;
  compiler.varsDict[name] = n;
  return n;
};

const parseVariable = (
  compiler: ChemCompiler,
  expr: string,
  pos: Int
): Double => {
  const k = expr.indexOf(":");
  return k < 0
    ? useVariable(compiler, expr, pos)
    : declareVariable(compiler, expr.slice(0, k), expr.slice(k + 1), pos);
};

const parseNumExt = (
  compiler: ChemCompiler,
  srcValue: string,
  valuePos: Int
): Double => {
  let k: Double = 1.0;
  let value: string = srcValue;
  let curPos = valuePos;
  if (srcValue.startsWith("-")) {
    k = -1.0;
    curPos++;
    value = value.slice(1);
  }
  if (value.startsWith("%")) {
    return parseVariable(compiler, value.slice(1), curPos + 1) * k;
  }
  return parseNumConst(compiler, value, curPos) * k;
};

export const parseNum = (
  compiler: ChemCompiler,
  value: string,
  pos: Int
): Double => {
  const v = value.trim();
  if (!v) return 0.0;
  const n = +v;
  return Number.isNaN(n) ? parseNumExt(compiler, v, pos) : n;
};
