/*
Средние точки ставятся перед описанием связи.
В итоге общий вектор связи является суммой средних точек и самой связи
Связь, имеющая средние точки, не может быть мягкой
 */

import { Point } from "../../math/Point";
import { ChemCompiler } from "../ChemCompiler";
import { ChemBond } from "../../core/ChemBond";
import { getNodeForced } from "./node";
import { scanArgs } from "../parse/scanArgs";
import { calcBondDirection, makeParamsDict } from "./bondUniversal";

export const applyMiddlePoints = (compiler: ChemCompiler, bond: ChemBond) => {
  const { middlePoints } = compiler;
  if (middlePoints.length === 0) {
    return;
  }
  const bondPoints: Point[] = middlePoints.map((it) => it.pt);
  bondPoints.push(bond.dir!);
  bond.middlePoints = bondPoints;
  bond.dir = bondPoints.reduce((acc, pt) => acc.iadd(pt), new Point());
  bond.soft = false;
  middlePoints.length = 0;
};

export const checkMiddlePoints = (compiler: ChemCompiler) => {
  if (compiler.middlePoints.length !== 0) {
    compiler.error("Invalid middle point", {
      pos: compiler.middlePoints[0]!.pos,
    });
  }
};

export const createMiddlePoint = (compiler: ChemCompiler) => {
  // compiler.curChar() == 'm'
  const startPos = compiler.pos - 1;
  compiler.pos++;
  if (compiler.curChar() !== "(") {
    compiler.error("Expected '(' after [S]", {
      pos: compiler.pos - 1,
      S: "_m",
    });
  }
  getNodeForced(compiler, true);
  compiler.pos++;
  const args = scanArgs(compiler);
  const params = makeParamsDict(args.args, args.argPos);
  const dir = calcBondDirection(compiler, params);
  compiler.middlePoints.push({ pt: dir, pos: startPos });
};
