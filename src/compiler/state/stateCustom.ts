import { CompilerState } from "../ChemCompiler";
import { addNodeItem } from "../main/addNodeItem";
import { ChemRadical } from "../../core/ChemRadical";
import { ChemCustom } from "../../core/ChemCustom";
import { scanPostItem } from "../parse/scanPostItem";
import { stateAgentMid } from "./stateAgentMid";
import { openBrace } from "../main/brackets";
import { replaceGreek } from "../parse/comment";
import { scanMarkupEnd } from "../../utils/markup";

/**
 * Создание абстрактного элемента или радикала
 */
export const stateCustom: CompilerState = (compiler) => {
  if (compiler.curChar() === "{") {
    //  {{
    return openBrace(compiler);
  }
  const startPos = compiler.pos; // pos установлен на символ, следующий за '{'
  compiler.pos = scanMarkupEnd(compiler.text, compiler.pos, "}") - 1;
  if (compiler.text[compiler.pos] !== "}")
    compiler.error("Abstract element is not closed", { pos: startPos - 1 });
  const s = replaceGreek(compiler.subStr(startPos));
  const item = addNodeItem(compiler, ChemRadical.dict[s] ?? new ChemCustom(s));
  compiler.pos++;
  scanPostItem(compiler, (it) => {
    item.n = it;
  });
  return compiler.setState(stateAgentMid);
};
