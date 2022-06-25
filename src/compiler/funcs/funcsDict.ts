import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import {
  funcAtomColor,
  funcAtomColor1,
  funcColor,
  funcItemColor,
  funcItemColor1,
} from "./funcColor";
import { funcDblAlign } from "./funcDblAlign";
import { funcL } from "./funcL";
import { funcM } from "./funcM";
import { funcnM } from "./funcnM";
import { funcSlope } from "./funcSlope";
import { funcVer } from "./funcVer";

type ChemFunc = (compiler: ChemCompiler, args: string[], argPos: Int[]) => void;

export const funcsDict: Record<string, ChemFunc> = {
  atomColor: funcAtomColor,
  atomColor1: funcAtomColor1,
  color: funcColor,
  dblAlign: funcDblAlign,
  itemColor: funcItemColor,
  itemColor1: funcItemColor1,
  L: funcL,
  M: funcM,
  nM: funcnM,
  slope: funcSlope,
  ver: funcVer,
};
