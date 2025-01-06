import * as React from "react";
import * as styles from "./Hints.module.css";

interface PropsHints {
  onHint(formula: string): void;
}

type HintItem = {
  name: string;
  formula: string;
};

const items: HintItem[] = [
  { name: "Potassium ferrocyanide", formula: "K4[Fe(CN)6]" },
  { name: "Benzene", formula: "/\\\\|`//`\\`||" },
  {
    name: "Phosgene with amines",
    formula: "COCl2 + 4{R}NH2 -> ({R}NH)2CO + 2[{R}NH3]^+Cl^−",
  },
  { name: "Ethanol", formula: "H-C-C-OH; H|#2|H; H|#3|H" },
  {
    name: "Vitamin C",
    formula: "HO\\/<`|dHO>\\:a`|dH;OH`\\`=<`/HO>_p#a_pO_p<//O>_p",
  },
  {
    name: "Sucrose",
    formula:
      "_(x-%a:.8,y%h:1,W+)<|OH>_(x-%b:1.2)<`|OH>_(x-%a,y-%h,W-)<|HO>_(x%a,y-%h)<`|CH2OH>_(x%b)O_(x%a,y%h)$slope(45)\\O/:a_(x%c:.8,y%h,W+)<|OH>_(x%b)<`|HO>_(x%c,y-%h,W-)<|CH2OH>_(x#-3;-5,y-.8)O_#a_(y-1.6)CH2OH",
  },
];

export const Hints: React.FC<PropsHints> = ({ onHint }) => (
  <div className={styles.hints}>
    {items.map(({ name, formula }) => (
      <button
        type="button"
        className={styles.hintItem}
        key={name}
        onClick={() => onHint(formula)}
      >
        {name}
      </button>
    ))}
  </div>
);
