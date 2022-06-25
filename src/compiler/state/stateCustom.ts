import { CompilerState } from "../ChemCompiler";
import { addNodeItem } from "../main/addNodeItem";
import { scanTo } from "../parse/scan";
import { ChemRadical } from "../../core/ChemRadical";
import { ChemCustom } from "../../core/ChemCustom";
import { scanPostItem } from "../parse/scanPostItem";
import { stateAgentMid } from "./stateAgentMid";

/**
 * Создание абстрактного элемента или радикала
 */
export const stateCustom: CompilerState = (compiler) => {
  const startPos = compiler.pos; // pos установлен на символ, следующий за '{'
  if (!scanTo(compiler, "}"))
    compiler.error("Abstract element is not closed", { pos: startPos - 1 });
  const s = compiler.subStr(startPos);
  const item = addNodeItem(compiler, ChemRadical.dict[s] ?? new ChemCustom(s));
  compiler.pos++;
  scanPostItem(compiler, (it) => {
    item.n = it;
  });
  return compiler.setState(stateAgentMid);
};
