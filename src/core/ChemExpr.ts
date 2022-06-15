import { Lang } from "../lang/Lang";
import { ChemObj } from "./ChemObj";
import { Visitor } from "./Visitor";
import { ChemAgent } from "./ChemAgent";

export class ChemExpr extends ChemObj {
  error?: Error;

  // Source description
  src0: string = "";

  // Description after preprocessing
  src: string = "";

  // Entities: reagents and operations
  entities: ChemObj[] = [];

  // Check for success. If false, then an error.
  isOk(): boolean {
    return !this.error;
  }

  // Extended error message. Empty string, if not error
  getMessage(locale?: string): string {
    const { error } = this;
    if (!error) return "";
    if (!locale) return error.message;
    const oldLang = Lang.curLang;
    Lang.curLang = locale;
    const { message } = error;
    Lang.curLang = oldLang;
    return message;
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

  /**
   * Если выражение состоит более чем из одного агента (а это не редкость),
   * то считать его общую массу через calcMass не имеет смысла.
   * Данная функция считает массу каждого агента отдельно.
   * @param applyK Если false, то не учитываются коэффициенты перед агентами.
   */
  // mass(applyK: boolean = true): Double[] {
  //     return this.getAgents().map(it => calcMass(it, applyK))
  // }
}
