import { ChemObj } from "../core/ChemObj";
import { ChemK } from "../core/ChemK";
import { Visitor } from "../core/Visitor";
import { ChemAgent } from "../core/ChemAgent";
import { ChemNodeItem } from "../core/ChemNodeItem";
import { ChemBracketEnd } from "../core/ChemBracket";
import { ChemMul } from "../core/ChemMul";

/**
 * Является ли указанное выражение абстрактным.
 * Это происходит при следующих условиях:
 * - Наличие абстрактного элемента: {R}-OH
 * - Наличие нечисловых коэффициентов: C'n'H'2n+2'
 * - Запятая: (Ca,Mg)SO4
 */
export const isAbstract = (chemObj: ChemObj): boolean => {
  const visitor = new IsAbstractVisitor();
  chemObj.walk(visitor);
  return visitor.isStop;
};

const isAbsK = (k?: ChemK): boolean => (k ? !k.isNumber() : false);

class IsAbstractVisitor implements Visitor {
  isStop: boolean = false;

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

  custom() {
    this.isStop = true;
  }

  comma() {
    this.isStop = true;
  }
}
