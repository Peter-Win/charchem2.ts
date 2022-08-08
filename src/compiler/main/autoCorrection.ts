import { Double, Int } from "../../types";
import { ChemBond } from "../../core/ChemBond";
import { ifDef } from "../../utils/ifDef";
import { makeBondStep } from "./bondSimple";
import { ChemCompiler } from "../ChemCompiler";
import { getLastBond } from "./bondUniversal";
import { is0 } from "../../math";

// -1, `-1, 0, 0, 1, `1
const horizAngles: Double[] = [-60.0, 120.0, 0.0, 0.0, 60.0, -120.0];

const newAngleDeg = (bond: ChemBond): Double =>
  horizAngles[(bond.slope + 1) * 2 + (bond.isNeg ? 1 : 0)]!;

const correct = (bond: ChemBond, length?: Double) => {
  bond.dir = makeBondStep(newAngleDeg(bond), length ?? bond.dir!.length());
  bond.isCorr = true;
  ifDef(bond.nodes[1], (it) => {
    it.pt = bond.calcPt();
  });
};

const correctPrev = (
  compiler: ChemCompiler,
  prevBond: ChemBond,
  length?: Double
) => {
  if (prevBond.nodes[1]?.fixed) {
    return;
  }
  const corrNode = prevBond.nodes[1];
  if (!corrNode) {
    correct(prevBond, length);
    return;
  }
  const { subChain } = corrNode;
  const oldPos = corrNode.pt;
  correct(prevBond, length);
  const step = corrNode.pt.minus(oldPos);
  const allNodes = compiler.curAgent!.nodes;
  const dstNodes = allNodes
    .slice(corrNode.index + 1)
    .filter((it) => it.subChain === subChain);
  dstNodes.reverse();
  dstNodes.forEach((it) => {
    it.pt.iadd(step);
  });
};

export const autoCorrection = (
  compiler: ChemCompiler,
  bond: ChemBond,
  slopeSign: Int
) => {
  if (compiler.varSlope !== 0.0) {
    // Если указан угол наклона при помощи $slope(x)
    return;
  }
  const prevBond = getLastBond(compiler);
  // Если нет предыдущей связи, то коррекция невозможна
  if (!prevBond) return;
  if (!prevBond.isAuto) {
    // Коррекция возможно только если предыдущая связь создана из простого описания
    return;
  }

  const { dir } = prevBond;
  if (prevBond.isAuto && dir && is0(dir.y) && slopeSign !== 0) {
    // Стыковка горизонтальной связи с наклонной
    correct(bond, compiler.varLength);
    return;
  }
  if (
    prevBond.slope !== 0 &&
    prevBond.isCorr &&
    slopeSign !== 0 &&
    prevBond.isNeg !== bond.isNeg
  ) {
    // Стыковка предыдущей откорректированной наклонной связи
    // с тем же наклоном, но в обратном направлении
    correct(bond, compiler.varLength);
    return;
  }
  // Варианты с коррекцией предыдущей связи
  if (
    prevBond.slope !== 0 &&
    !prevBond.isCorr &&
    slopeSign !== 0 &&
    prevBond.isNeg !== bond.isNeg &&
    prevBond.slope !== bond.slope
  ) {
    correctPrev(compiler, prevBond);
    correct(bond, compiler.varLength);
    return;
  }
  // Стыковка с горизонтальной связью
  if (prevBond.slope !== 0 && !prevBond.isCorr && bond.isHorizontal()) {
    correctPrev(compiler, prevBond);
  }
};
