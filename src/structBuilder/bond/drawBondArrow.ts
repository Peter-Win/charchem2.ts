import { Point } from "../../math/Point";
import { PathSeg } from "../../drawSys/path";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { PathStyle } from "../../drawSys/AbstractSurface";
import { FigPath } from "../../drawSys/figures/FigPath";

export const drawBondArrow = (
  frame: FigFrame,
  imgProps: ChemImgProps,
  a: Point,
  b: Point,
  color: string
) => {
  const { arrowL, arrowD, lineWidth } = imgProps;
  const n = a.minus(b).normal();
  const c = b.plus(n.times(arrowL));
  const cL = c.plus(n.transpon(true).times(arrowD));
  const cR = c.plus(n.transpon().times(arrowD));
  const segs: PathSeg[] = [
    { cmd: "M", pt: cR },
    { cmd: "L", pt: b },
    { cmd: "L", pt: cL },
  ];
  const style: PathStyle = {
    stroke: color,
    strokeWidth: lineWidth,
  };
  const fig = new FigPath(segs, style);
  fig.update();
  frame.addFigure(fig, true);
};
