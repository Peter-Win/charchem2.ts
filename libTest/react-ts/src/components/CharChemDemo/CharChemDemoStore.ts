import { makeAutoObservable } from "mobx";
import { ChemExpr } from "charchem2/core/ChemExpr";
import { compile } from "charchem2/compiler/compile";
import { ChemFormulaMode } from "../ChemFormula";

export type FormulaTheme = "dark" | "light";

export type FormulaSize = "double" | "normal" | "quadruple";

export const charChemDemoStore = makeAutoObservable({
  srcFormula: "",
  setSrcFormula(value: string) {
    this.srcFormula = value;
  },
  get expression(): ChemExpr | null {
    return this.srcFormula ? compile(this.srcFormula) : null;
  },

  viewMode: "auto" as ChemFormulaMode,
  setViewMode(mode: ChemFormulaMode) {
    this.viewMode = mode;
  },

  theme: "light" as FormulaTheme,
  setTheme(value: FormulaTheme) {
    this.theme = value;
  },

  size: "normal" as FormulaSize,
  setSize(value: FormulaSize) {
    this.size = value;
  },
});

export type CharChemDemoStore = typeof charChemDemoStore;
