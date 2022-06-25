import { CompilerState } from "../ChemCompiler";
import { scan } from "../parse/scan";
import { findElement } from "../../core/PeriodicTable";
import { ChemRadical } from "../../core/ChemRadical";
import { ChemSubObj } from "../../core/ChemSubObj";
import { addNodeItem } from "../main/addNodeItem";
import { statePostItem } from "./statePostItem";

// Извлечение элемента. Позиция первого символа elementStartPos
export const stateElement: CompilerState = (compiler) => {
  scan(compiler, (it) => it >= "a" && it <= "z");
  const id = compiler.subStr(compiler.elementStartPos);
  const elem: ChemSubObj =
    findElement(id) ??
    ChemRadical.dict[id] ??
    compiler.error("Unknown element '[Elem]'", {
      pos: compiler.elementStartPos,
      Elem: id,
    });
  addNodeItem(compiler, elem);
  return compiler.setState(statePostItem);
};
