import { ChemBond } from "../../core/ChemBond";
import { ChemCompiler } from "../ChemCompiler";
/*
Суффиксы позволяют указать одну из следующих модификаций для только что объявленной связи.
Во всех версиях используется с краткими описаниями связей.
Начиная с версии 1.0 может применяться к полигональным связям

Для полигональной связи не может использоваться 0, т.к. он воспринимается как часть числа, означающего число углов полигона
Поэтому для пустой связи нужно использовать o
 */

type Action = (bond: ChemBond) => void;
// private data class SuffixDef(val suffix: String, val action: (bond: ChemBond) -> Unit)

const bondSuffixes: [string, Action][] = [
  [
    "0",
    (bond) => {
      bond.n = 0.0;
    },
  ],
  [
    "o",
    (bond) => {
      bond.n = 0.0;
    },
  ],
  ["h", (bond) => bond.setHydrogen()],
  [
    "ww",
    (bond) => {
      bond.w0 = 1;
    },
  ],
  [
    "w",
    (bond) => {
      bond.w1 = 1;
    },
  ],
  [
    "dd",
    (bond) => {
      bond.w0 = -1;
    },
  ],
  [
    "d",
    (bond) => {
      bond.w1 = -1;
    },
  ],
  ["x", (bond) => bond.setCross()],
  [
    "~",
    (bond) => {
      bond.style = "~";
    },
  ],
  [
    "r",
    (bond) => {
      bond.align = "r";
    },
  ],
  [
    "m",
    (bond) => {
      bond.align = "m";
    },
  ],
  [
    "l",
    (bond) => {
      bond.align = "l";
    },
  ],
  [
    "vvv",
    (bond) => {
      bond.arr0 = true;
      bond.arr1 = true;
    },
  ],
  [
    "vv",
    (bond) => {
      bond.arr0 = true;
    },
  ],
  [
    "v",
    (bond) => {
      bond.arr1 = true;
    },
  ],
];

export const scanBondSuffix = (compiler: ChemCompiler, bond: ChemBond) => {
  const rec = bondSuffixes.find(([suffix]) => compiler.isCurPosEq(suffix));
  if (rec) {
    const [suffix, action] = rec;
    action(bond);
    compiler.pos += suffix.length;
  }
};
