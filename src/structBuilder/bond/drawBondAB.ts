import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { PathStyle } from "../../drawSys/AbstractSurface";
import { FigPath } from "../../drawSys/figures/FigPath";
import { PathSeg } from "../../drawSys/path";
import { ChemBond } from "../../core/ChemBond";
import { Point } from "../../math/Point";
import { getBondColor } from "./getBondColor";

interface ParamsDrawBondAB {
  bond: ChemBond;
  bondA: Point;
  bondB: Point;
  imgProps: ChemImgProps;
  frame: FigFrame;
}

export const drawBondAB = ({
  bond,
  bondA,
  bondB,
  imgProps,
  frame,
}: ParamsDrawBondAB) => {
  const { lineWidth } = imgProps;
  const style: PathStyle = {
    stroke: getBondColor(bond, imgProps),
    strokeWidth: lineWidth,
  };
  const segs: PathSeg[] = [
    { cmd: "M", rel: false, pt: bondA },
    { cmd: "L", rel: false, pt: bondB },
  ];
  const fig = new FigPath(segs, style);
  frame.addFigure(fig);
};
