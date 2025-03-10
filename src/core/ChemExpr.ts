import { SrcMapItem } from "../compiler/sourceMap/SrcMapItem";
import { Double } from "../types";
import { ChemObj } from "./ChemObj";
import { Visitor } from "./Visitor";
import { ChemAgent } from "./ChemAgent";
import { getErrorMessage } from "./ChemError";
import { calcMass } from "../inspectors/calcMass";
import { isTextFormula } from "../inspectors/isTextFormula";
import { getSrcItemsForObject } from "../compiler/sourceMap";
import { textFormula } from "../textBuilder/textFormula";

export class ChemExpr extends ChemObj {
  error?: Error;

  // Source description
  src0: string = "";

  // Description after preprocessing
  src: string = "";

  // Entities: reagents and operations
  entities: ChemObj[] = [];

  srcMap?: SrcMapItem[];

  // Check for success. If false, then an error.
  isOk(): boolean {
    return !this.error;
  }

  // Extended error message. Empty string, if not error
  getMessage(locale?: string): string {
    const { error } = this;
    return error ? getErrorMessage(error, locale) : "";
  }

  override walk(visitor: Visitor) {
    for (const entity of this.entities) {
      visitor.entityPre?.(entity);
      if (visitor.isStop) return;
      entity.walk(visitor);
      if (visitor.isStop) return;
      visitor.entityPost?.(entity);
      if (visitor.isStop) return;
    }
  }

  getAgents(): ChemAgent[] {
    // Правильно было бы использовать walk.
    // Но этот вариант работает быстрее, т.к. walk обходит все подчиненные объекты.
    // А здесь просто цикл по сущностям верхего уровня, которых обычно не более 10.
    const result = this.entities.filter(
      (entity: ChemObj) => entity instanceof ChemAgent
    );
    return result as ChemAgent[];
  }

  findMapItems(target: ChemObj): SrcMapItem[] {
    return getSrcItemsForObject(target, this.srcMap);
  }

  srcMapItemText(item: SrcMapItem): string {
    return this.src.slice(item.begin, item.end);
  }

  /**
   * Если выражение состоит более чем из одного агента (а это не редкость),
   * то считать его общую массу через calcMass не имеет смысла.
   * Данная функция считает массу каждого агента отдельно.
   * @param applyK Если false, то не учитываются коэффициенты перед агентами.
   */
  mass(applyK: boolean = true): Double[] {
    return this.getAgents().map((it) => calcMass(it, applyK));
  }

  /**
   * This method has been added for compatibility with previous versions.
   * It is recommended to explicitly use function textFormula.
   * @deprecated
   */
  html(poor = false): string {
    return textFormula(this, poor ? "htmlPoor" : "html");
  }

  /**
   * This method has been added for compatibility with previous versions.
   * It is recommended to explicitly use function isTextFormula.
   */
  isLinear(): boolean {
    return isTextFormula(this);
  }

  static createWithError(error: Error, src: string) {
    const expr = new ChemExpr();
    expr.error = error;
    expr.src0 = src;
    expr.src = src;
    return expr;
  }
}
