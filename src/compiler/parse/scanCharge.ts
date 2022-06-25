import { ChemCompiler } from "../ChemCompiler";
import { ChemCharge, createCharge } from "../../core/ChemCharge";

// Извлечение заряда из текущей позиции.
// Возвращает объект ChemCharge или null

export const scanCharge = (
  compiler: ChemCompiler,
  isLeft: boolean
): ChemCharge | undefined => {
  if (compiler.isFinish()) return undefined;
  const pos0 = compiler.pos;
  let prevCharge: ChemCharge | undefined;
  for (;;) {
    compiler.pos++;
    const charge = createCharge(compiler.subStr(pos0), isLeft);
    if (!charge) {
      compiler.pos--;
      break;
    }
    prevCharge = charge;
    if (compiler.isFinish()) break;
  }
  return prevCharge;
};
