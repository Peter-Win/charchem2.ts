import { ChemCompiler } from "../ChemCompiler";
import { ChemCharge, createCharge } from "../../core/ChemCharge";
import { CoeffPosOrAngle } from "../../types/CoeffPos";

// Извлечение заряда из текущей позиции.
// Возвращает объект ChemCharge или null

export const scanCharge = (
  compiler: ChemCompiler,
  coeffPos: CoeffPosOrAngle = "RT"
): ChemCharge | undefined => {
  if (compiler.isFinish()) return undefined;
  const pos0 = compiler.pos;
  let prevCharge: ChemCharge | undefined;
  for (;;) {
    compiler.pos++;
    const charge = createCharge(compiler.subStr(pos0), coeffPos);
    if (!charge) {
      compiler.pos--;
      break;
    }
    prevCharge = charge;
    if (compiler.isFinish()) break;
  }
  return prevCharge;
};
