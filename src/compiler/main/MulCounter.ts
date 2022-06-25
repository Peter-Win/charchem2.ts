import { Int } from "../../types";
import { ChemMul } from "../../core/ChemMul";

/*
 Множители появляются:
 - после символа *;
 - сразу после открытия скобки (это новая фича для версии 1.2)
 Закрываются автоматически:
 - перед символом *
 - перед закрытием СООТВЕТСТВУЮЩЕЙ скобки
 - в конце агента
 */

export class MulCounter {
  private mul?: ChemMul;

  private bracketCounter: Int = 0;

  onOpenBracket() {
    if (this.mul) {
      ++this.bracketCounter;
    }
  }

  onCloseBracket() {
    if (this.mul) {
      --this.bracketCounter;
    }
  }

  close() {
    this.mul = undefined;
  }

  create(newMul: ChemMul) {
    this.mul = newMul;
  }

  getMulForBracket(): ChemMul | undefined {
    return this.bracketCounter > 0 ? undefined : this.mul;
  }

  getMulForced(): ChemMul | undefined {
    return this.mul;
  }
}
