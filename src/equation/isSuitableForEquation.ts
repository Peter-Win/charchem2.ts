import { ChemMul } from "../core/ChemMul";
import { ChemExpr } from "../core/ChemExpr";
import { ChemNodeItem } from "../core/ChemNodeItem";

type NegativeResult = {
  reason: "abstract" | "float";
  msgId: string;
};

const msgAbs = "Cant balance expression with abstract coefficients";

/**
 *  Нельзя искать баланс для уравнений, имеющий абстрактные или не целочисленные коэффициенты
 * При этом, нас интересуют коэффициенты при элементах, но не важны коэффициенты агентов
 * @param expr
 */
export const isSuitableForEquation = (
  expr: ChemExpr
): NegativeResult | undefined =>
  expr.walkExt({
    isStop: false as boolean,
    result: undefined as NegativeResult | undefined,
    itemPre({ n }: ChemNodeItem) {
      if (!n.isNumber()) {
        this.result = {
          reason: "abstract",
          msgId: msgAbs,
        };
      } else if (!n.isInt()) {
        this.result = {
          reason: "float",
          msgId: "Cant balance expression with non-integer coefficients",
        };
      }
      this.isStop = !!this.result;
    },
    mul({ n }: ChemMul) {
      if (!n.isNumber()) {
        this.result = {
          reason: "abstract",
          msgId: msgAbs,
        };
      }
    },
    comma() {
      this.result = {
        reason: "abstract",
        msgId: "Cant balance expression with mineral series",
      };
    },
  }).result;
