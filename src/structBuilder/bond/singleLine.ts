import { PathStyle } from "../../drawSys/AbstractSurface";
import { ChemImgProps } from "../../drawSys/ChemImgProps";
import { Point } from "../../math/Point";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { PathSeg } from "../../drawSys/path";
import { FigPath } from "../../drawSys/figures/FigPath";
import { getBondStyleWidth } from "./getBondStyleWidth";
import { Figure } from "../../drawSys/figures/Figure";
import { ChemBond } from "../../core/ChemBond";
import { FigHashTrapezoid } from "../../drawSys/figures/FigHashTrapezoid";

export const singleLine = (
  bond: ChemBond,
  frame: FigFrame,
  imgProps: ChemImgProps,
  a: Point,
  b: Point,
  style: string | undefined,
  color: string
) => {
  const lnStyle: PathStyle = {
    stroke: color,
    strokeWidth: getBondStyleWidth(imgProps, style),
    cap: "round",
  };
  let fig: Figure | undefined;
  if (style === "~") {
    fig = drawWaveLine(bond, a, b, imgProps, lnStyle);
  } else if (style === ":") {
    fig = drawDashedLine(a, b, imgProps, lnStyle);
  } else if (bond.w0 < 0 && bond.w0 === bond.w1) {
    const { thickWidth, lineWidth } = imgProps;
    fig = new FigHashTrapezoid(a, thickWidth, b, thickWidth, color, lineWidth);
    fig.update();
  }
  if (!fig) {
    const segs: PathSeg[] = [
      { cmd: "M", rel: false, pt: a },
      { cmd: "L", rel: false, pt: b },
    ];
    fig = new FigPath(segs, lnStyle);
    fig.update();
  }
  frame.addFigure(fig);
};

const drawWaveLine = (
  bond: ChemBond,
  p0: Point,
  p1: Point,
  imgProps: ChemImgProps,
  style: PathStyle
) => {
  const srcSpace = !!bond.arr0;
  const dstSpace = !!bond.arr1;
  const { line, arrowL } = imgProps;
  const ampl = line / 8;
  const step = line / 6;
  const arrLen = arrowL * 1.4; // Если стрелка впритык к изгибу, это выглядит плохо

  const dir = p1.minus(p0);
  let len = dir.length();
  const d1 = dir.normal();
  if (srcSpace) len -= arrLen;
  if (dstSpace) len -= arrLen;
  if (len < step) return undefined;
  const wp0 = srcSpace ? p0.plus(d1.times(arrLen)) : p0;
  const wp1 = dstSpace ? p1.minus(d1.times(arrLen)) : p1;

  const nSegs = Math.floor((len + step / 2) / step);
  const vAmp = d1.times(ampl);
  const segDir = wp1.minus(wp0).times(1 / nSegs);
  const segs: PathSeg[] = [{ cmd: "M", pt: p0 }];
  if (srcSpace) segs.push({ cmd: "L", pt: wp0 });
  let a: Point = wp0;
  for (let k = 0; k < nSegs; k++) {
    const pt = a.plus(segDir);
    const cp1 = a.plus(
      // eslint-disable-next-line no-bitwise
      (k & 1) === 0 ? new Point(vAmp.y, -vAmp.x) : new Point(-vAmp.y, vAmp.x)
    );
    const cp2 = cp1.plus(segDir);
    segs.push({ cmd: "C", cp1, cp2, pt });
    a = pt;
  }
  if (dstSpace) segs.push({ cmd: "L", pt: p1 });
  const fig = new FigPath(segs, style);
  fig.update();
  return fig;
};

const drawDashedLine = (
  p0: Point,
  p1: Point,
  imgProps: ChemImgProps,
  style: PathStyle
) => {
  // Общее число отрезков: n. Число всегда нечётное.
  const dir = p1.minus(p0);
  const len = dir.length();
  const { dash } = imgProps;
  if (len < dash * 2) {
    // Отрезок слишком короткий, чтобы выводиться прерывистой линией
    return undefined;
  }
  let n = Math.floor(len / dash);
  // eslint-disable-next-line no-bitwise
  if (!(n & 1)) n++;
  const segLen = len / n;
  const segs: PathSeg[] = [{ cmd: "M", pt: p0 }];
  for (let i = 0; i < n; i++) {
    const pt = dir.times(((i + 1) * segLen) / len).iadd(p0);
    // eslint-disable-next-line no-bitwise
    segs.push({ cmd: (i & 1) === 0 ? "L" : "M", pt });
  }
  const fig = new FigPath(segs, style);
  fig.update();
  return fig;
};
