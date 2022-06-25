import { ChemCompiler } from "../ChemCompiler";
import { ChemK } from "../../core/ChemK";
import { scanCoeff } from "./scanCoeff";
import { ifDef } from "../../utils/ifDef";

export const scanPostItem = (
  compiler: ChemCompiler,
  onCoeff: (coeff: ChemK) => void
): boolean =>
  ifDef(scanCoeff(compiler), (it) => {
    onCoeff(it);
    return true;
  }) ?? false;
