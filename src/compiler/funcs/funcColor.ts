/* eslint-disable @typescript-eslint/no-unused-vars */
import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";

export const funcColor = (
  compiler: ChemCompiler,
  [value]: string[],
  pos: Int[]
) => {
  compiler.varColor = value;
};

export const funcItemColor = (
  compiler: ChemCompiler,
  [value]: string[],
  // @Suppress("UNUSED_PARAMETER")
  pos: Int[]
) => {
  compiler.varItemColor = value;
};

export const funcItemColor1 = (
  compiler: ChemCompiler,
  [value]: string[],
  // @Suppress("UNUSED_PARAMETER")
  pos: Int[]
) => {
  compiler.varItemColor1 = value;
};

export const funcAtomColor = (
  compiler: ChemCompiler,
  [value]: string[],
  // @Suppress("UNUSED_PARAMETER")
  pos: Int[]
) => {
  compiler.varAtomColor = value;
};

export const funcAtomColor1 = (
  compiler: ChemCompiler,
  [value]: string[],
  // @Suppress("UNUSED_PARAMETER")
  pos: Int[]
) => {
  compiler.varAtomColor1 = value;
};
