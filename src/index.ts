import { addAutoCompileEvent } from "./browser/autoCompile";
import { ChemSys } from "./ChemSys";
import { PeriodicTable } from "./core/PeriodicTable";

export { ChemSys };

if (typeof window !== "undefined") {
  // @ts-ignore
  window.ChemSys = ChemSys;
  // deprecated. Used for compatibility with previous versions.
  // @ts-ignore
  window.MenTblArray = PeriodicTable.elements;
  // @ts-ignore
  window.MenTbl = PeriodicTable.dict;
  addAutoCompileEvent();
}
