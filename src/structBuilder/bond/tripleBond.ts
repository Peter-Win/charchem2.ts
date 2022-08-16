import { Point } from "../../math/Point";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { getBondStyleWidth } from "./getBondStyleWidth";
import { singleLine } from "./singleLine";
import { ChemBond } from "../../core/ChemBond";

export const tripleBond = (
  bond: ChemBond,
  frame: FigFrame,
  imgProps: ChemImgProps,
  a: Point,
  b: Point,
  styles: string[],
  color: string
) => {
  //   left = style#0
  //   |
  //   a********************>b
  //   |
  //   right = style#2
  const dir = b.minus(a);
  const d1 = dir.normal();
  const { lineSpace3 } = imgProps;
  const styleLeft = styles[0];
  const styleCenter = styles[1];
  const styleRight = styles[2];
  const wL = getBondStyleWidth(imgProps, styleLeft);
  const wC = getBondStyleWidth(imgProps, styleCenter);
  const wR = getBondStyleWidth(imgProps, styleRight);
  const left1 = d1.transpon(true).times(lineSpace3 + (wL + wC) / 2);
  const right1 = d1.transpon().times(lineSpace3 + (wR + wC) / 2);
  singleLine(
    bond,
    frame,
    imgProps,
    a.plus(left1),
    b.plus(left1),
    styleLeft,
    color
  );
  singleLine(bond, frame, imgProps, a, b, styleCenter, color);
  singleLine(
    bond,
    frame,
    imgProps,
    a.plus(right1),
    b.plus(right1),
    styleRight,
    color
  );
};
