import { FigHashTrapezoid } from "../../drawSys/figures/FigHashTrapezoid";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { FigPath } from "../../drawSys/figures/FigPath";
import { Figure } from "../../drawSys/figures/Figure";
import { PathSeg } from "../../drawSys/path";
import { Point } from "../../math/Point";

export const wedgeBond = (
  src: Point,
  dst: Point,
  imgProps: ChemImgProps,
  color: string,
  hash: boolean
): Figure => {
  const { chiralWidth, lineWidth } = imgProps;
  if (hash) {
    return new FigHashTrapezoid(
      src,
      lineWidth,
      dst,
      chiralWidth,
      color,
      lineWidth
    );
  }
  const d1 = dst.minus(src).normal();
  const left = d1.transpon(true).times(chiralWidth / 2);
  const right = d1.transpon().times(chiralWidth / 2);
  const b = dst.plus(left);
  const c = dst.plus(right);
  const left0 = d1.transpon(true).times(lineWidth / 2);
  const right0 = d1.transpon().times(lineWidth / 2);
  const segs: PathSeg[] = [
    { cmd: "M", pt: src.plus(left0) },
    { cmd: "L", pt: b },
    { cmd: "L", pt: c },
    { cmd: "L", pt: src.plus(right0) },
    { cmd: "Z" },
  ];
  return new FigPath(segs, {
    fill: color,
    cap: "round",
    strokeWidth: lineWidth,
  });
};
