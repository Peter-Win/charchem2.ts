import { ChemObj } from "../core/ChemObj";
import { ChemK } from "../core/ChemK";
import { Visitor } from "../core/Visitor";
import { ChemAgent } from "../core/ChemAgent";
import { ChemNodeItem } from "../core/ChemNodeItem";
import { ChemBracketEnd } from "../core/ChemBracket";
import { ChemMul } from "../core/ChemMul";
import { ChemCustom } from "../core/ChemCustom";

/**
 * Является ли указанное выражение абстрактным.
 * Это происходит при следующих условиях:
 * - Наличие абстрактного элемента: {R}-OH
 * - Наличие нечисловых коэффициентов: C'n'H'2n+2'
 * - Запятая: (Ca,Mg)SO4
 */
export const isAbstract = (chemObj: ChemObj): boolean => {
  const visitor = new IsAbstractVisitor(true);
  chemObj.walk(visitor);
  return visitor.isStop;
};

export const isAbstractCoeffs = (chemObj: ChemObj): boolean => {
  const visitor = new IsAbstractVisitor(false);
  chemObj.walk(visitor);
  return visitor.isStop;
};

const isAbsK = (k?: ChemK): boolean => (k ? !k.isNumber() : false);

class IsAbstractVisitor implements Visitor {
  isStop: boolean = false;

  constructor(private useItems: boolean) {}

  agentPre(obj: ChemAgent) {
    this.isStop = isAbsK(obj.n);
  }

  itemPre(obj: ChemNodeItem) {
    this.isStop = isAbsK(obj.n);
  }

  bracketEnd(obj: ChemBracketEnd) {
    this.isStop = isAbsK(obj.n);
  }

  mul(obj: ChemMul) {
    this.isStop = isAbsK(obj.n);
  }

  custom(obj: ChemCustom) {
    // Наличие пустых узлов не делает формулу абстрактной, т.к. они нужны для фиктивных элементов
    if (this.useItems && obj.text) {
      this.isStop = true;
    }
  }

  comma() {
    if (this.useItems) {
      this.isStop = true;
    }
  }
}
