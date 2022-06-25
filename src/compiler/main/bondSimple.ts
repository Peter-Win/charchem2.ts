import { Double, Int } from "../../types";
import { pointFromDeg, Point } from "../../math/Point";
import { ChemCompiler } from "../ChemCompiler";
import { ChemBond } from "../../core/ChemBond";
import { createCommonBond, onOpenBond } from "./bondCommon";
import { scanBondSuffix } from "../parse/scanBondSuffix";
import { autoCorrection } from "./autoCorrection";

/**
 * Вектор связи.
 * @param angleDegree Точное значениеугла в градусах. Не допускается 0
 * @param length Длина из compiler.varLength. Значение 0 воспринимается как 1
 */
export const makeBondStep = (angleDegree: Double, length: Double) =>
  pointFromDeg(angleDegree).times(length === 0.0 ? 1.0 : length);

// 0=(кратность), 1=(угол в градусах), 2=(знак наклона), 3=(признак мягкой связи), 4=(текст)
class BondDef {
  constructor(
    public readonly n: Int,
    public readonly angle: Int,
    public readonly slope: Int,
    public readonly soft: boolean = false,
    public readonly text?: string
  ) {}

  create(compiler: ChemCompiler, bondId: string): ChemBond {
    const bond = createCommonBond(compiler);
    bond.tx = this.text ?? bondId;
    bond.n = this.n as Double;
    bond.soft = this.soft;
    bond.dir = this.calcDir(compiler, bond);
    bond.slope = this.slope;
    bond.isAuto = true;
    bond.isText = this.angle === 0 && this.slope === 0;
    autoCorrection(compiler, bond, this.slope);
    return bond;
  }

  calcDir(compiler: ChemCompiler, bond: ChemBond): Point {
    let angleDegree: Double;
    if (this.slope === 0) {
      angleDegree = this.angle as Double;
    } else {
      bond.slope = this.slope;
      const srcAngle = compiler.varSlope === 0.0 ? 30.0 : compiler.varSlope;
      angleDegree = srcAngle * this.slope;
    }
    if (compiler.getAltFlag()) {
      angleDegree += 180.0;
      bond.isNeg = true;
    }
    return makeBondStep(angleDegree, compiler.varLength);
  }
}

const soft1 = new BondDef(1, 0, 0, true, "-");
const soft3 = new BondDef(3, 0, 0, true, "≡");

const bondDefDict: Record<string, BondDef> = {
  "-": soft1,
  "–": soft1, // special character u2013
  "−": soft1, // u2212
  "=": new BondDef(2, 0, 0, true),
  "%": soft3,
  "≡": soft3,
  "--": new BondDef(1, 0, 0, false, "-"),
  "==": new BondDef(2, 0, 0, false, "="),
  "%%": new BondDef(3, 0, 0, false, "≡"),
  "|": new BondDef(1, 90, 0),
  "||": new BondDef(2, 90, 0),
  "|||": new BondDef(3, 90, 0),
  "/": new BondDef(1, 0, -1),
  "//": new BondDef(2, 0, -1),
  "///": new BondDef(3, 0, -1),
  "\\": new BondDef(1, 0, 1),
  "\\\\": new BondDef(2, 0, 1),
  "\\\\\\": new BondDef(3, 0, 1),
};

export const scanSimpleBond = (
  compiler: ChemCompiler
): ChemBond | undefined => {
  let bondId = "";
  let bondDef: BondDef | null = null;
  for (;;) {
    const curBondId = bondId + compiler.curChar();
    // Постепенно увеличиваем длину описания
    // Как только получается несуществующее описание, то закончить цикл
    const curBondDef = bondDefDict[curBondId];
    if (!curBondDef) return bondDef?.create(compiler, bondId);
    bondId = curBondId;
    bondDef = curBondDef;
    compiler.pos++;
  }
};

export const createSimpleBond = (compiler: ChemCompiler, bond: ChemBond) => {
  scanBondSuffix(compiler, bond);
  onOpenBond(compiler, bond);
};
