import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { ChemBond } from "../../core/ChemBond";
import { Point } from "../../math/Point";
import { getBondColor } from "./getBondColor";
import { tripleBond } from "./tripleBond";
import { singleLine } from "./singleLine";
import { doubleBond } from "./doubleBond";
import { Figure } from "../../drawSys/figures/Figure";
import { wedgeBond } from "./wedgeBond";
import { drawBondArrow } from "./drawBondArrow";
import { StructAnalyzer } from "../../core/StructAnalyzer";

interface ParamsDrawBondAB {
  bond: ChemBond;
  bondA: Point;
  bondB: Point;
  imgProps: ChemImgProps;
  frame: FigFrame;
  stA: StructAnalyzer;
}

export const drawBondAB = ({
  bond,
  bondA,
  bondB,
  imgProps,
  frame,
  stA,
}: ParamsDrawBondAB) => {
  const { n, style, w0, w1 } = bond;
  const color = getBondColor(bond, imgProps);
  let fig: Figure | undefined;
  if (!w0 && w1 === 1) {
    fig = wedgeBond(bondA, bondB, imgProps, color, false);
  } else if (w0 === 1 && !w1) {
    fig = wedgeBond(bondB, bondA, imgProps, color, false);
  } else if (!w0 && w1 === -1) {
    fig = wedgeBond(bondA, bondB, imgProps, color, true);
  } else if (w0 === -1 && !w1) {
    fig = wedgeBond(bondB, bondA, imgProps, color, true);
  }
  if (fig) {
    fig.update();
    frame.addFigure(fig);
    return;
  }
  const stList: string[] = style ? Array.from(style) : new Array(n).fill("|");
  stList.reverse();
  if (stList.length === 1 && bond.w0 === 1 && bond.w1 === 1) {
    stList[0] = "I";
  }
  switch (stList.length) {
    case 1:
      singleLine(bond, frame, imgProps, bondA, bondB, stList[0], color);
      if (bond.arr1) drawBondArrow(frame, imgProps, bondA, bondB, color);
      if (bond.arr0) drawBondArrow(frame, imgProps, bondB, bondA, color);
      break;
    case 2:
      doubleBond({
        bond,
        frame,
        imgProps,
        p0: bondA,
        p1: bondB,
        styles: stList,
        color,
        align: bond.align,
        stA,
      });
      break;
    case 3:
      tripleBond(bond, frame, imgProps, bondA, bondB, stList, color);
      break;
    default:
      break;
  }
};
