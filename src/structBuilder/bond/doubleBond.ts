import { StructAnalyzer } from "../../core/StructAnalyzer";
import { BondAlign, ChemBond } from "../../core/ChemBond";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { Point } from "../../math/Point";
import { getBondStyleWidth } from "./getBondStyleWidth";
import { singleLine } from "./singleLine";

const getAlignSign = (
  bond: ChemBond,
  stA: StructAnalyzer,
  align?: BondAlign
): 0 | 1 | -1 => {
  if (!align) {
    return stA.calcBondSign(bond);
  }
  switch (align) {
    case "l":
      return -1;
    case "r":
      return 1;
    default:
      return 0;
  }
};

// Нужно ли делать отступ для внутренней линии, чтобы она была короче внешней
const isPadding = (bond: ChemBond, side: number): boolean | undefined => {
  const node = bond.nodes[side];
  // Узел должен быть автоматическим и иметь более одной связи
  return node && node.autoMode && node.bonds.size > 1;
};

interface ParamsDoubleBond {
  bond: ChemBond;
  frame: FigFrame;
  imgProps: ChemImgProps;
  p0: Point;
  p1: Point;
  styles: string[];
  color: string;
  align?: BondAlign;
  stA: StructAnalyzer;
}

export const doubleBond = ({
  bond,
  frame,
  imgProps,
  p0,
  p1,
  styles,
  color,
  align,
  stA,
}: ParamsDoubleBond) => {
  const dir = p1.minus(p0);
  const d1 = dir.normal();
  const styleL = styles[0];
  const styleR = styles[1];
  const left1 = d1.transpon(true);
  const right1 = d1.transpon();
  const wL = getBondStyleWidth(imgProps, styleL);
  const wR = getBondStyleWidth(imgProps, styleR);
  let aL;
  let bL;
  let aR;
  let bR: Point;
  if (align === "x") {
    const { lineSpace2x } = imgProps;
    const dL = left1.times((wL + lineSpace2x) / 2);
    const dR = right1.times((wR + lineSpace2x) / 2);
    aL = p0.plus(dL);
    aR = p0.plus(dR);
    bL = p1.plus(dR); // cross left to right
    bR = p1.plus(dL);
  } else {
    const aSign = getAlignSign(bond, stA, align);
    const { lineSpace2 } = imgProps;
    let dL;
    let dR: Point;
    if (aSign < 0) {
      dL = left1.times((wL + wR) / 2 + lineSpace2);
      dR = Point.zero;
    } else if (aSign > 0) {
      dL = Point.zero;
      dR = right1.times((wL + wR) / 2 + lineSpace2);
    } else {
      dL = left1.times((wL + lineSpace2) / 2);
      dR = right1.times((wR + lineSpace2) / 2);
    }
    aL = p0.plus(dL);
    aR = p0.plus(dR);
    bL = p1.plus(dL);
    bR = p1.plus(dR);
    if (isPadding(bond, 0)) {
      if (aSign < 0) aL.iadd(d1.times(lineSpace2));
      else if (aSign > 0) aR.iadd(d1.times(lineSpace2));
    }
    if (isPadding(bond, 1)) {
      if (aSign < 0) bL.isub(d1.times(lineSpace2));
      else if (aSign > 0) bR.isub(d1.times(lineSpace2));
    }
  }
  singleLine(bond, frame, imgProps, aL, bL, styleL, color);
  singleLine(bond, frame, imgProps, aR, bR, styleR, color);
};
