import { ChemBond } from "../../core/ChemBond";
import { Int, Char, Double } from "../../types";
import { Point, pointFromDeg, pointFromRad } from "../../math/Point";
import { rad2deg } from "../../math/radians";
import { ChemCompiler } from "../ChemCompiler";
import { listToDict } from "../../utils/listToDict";
import { findNodeEx } from "./findNode";
import { ifDef } from "../../utils/ifDef";
import { parseNum } from "../parse/parseNum";
import {
  createCommonBond,
  getNodeForBondStart,
  onOpenBond,
} from "./bondCommon";
/*
Геометрические параметры: A, a, L, P, p, x, y
Несовместимы между собой: p, P, a, A. (В порядке убывания приоритета) Зато их можно комбинировать их с x, y
L обычно использования совместно с A или a. Может быть использовано с P, хотя в этом мало пользы.
 */

export interface UniBondParam {
  key: Char;
  value: string;
  valuePos: Int;
}

type BondParams = Record<Char, UniBondParam | undefined>;

export const makeParamsDict = (args: string[], argPos: Int[]): BondParams => {
  const paramsList = args
    .map((descr, index) =>
      !descr
        ? null
        : {
            key: descr[0],
            value: descr.substring(1),
            valuePos: argPos[index]! + 1,
          }
    )
    .filter((it) => it) as UniBondParam[];
  return listToDict(paramsList, ({ key }) => key);
};

export const calcPolygonDir = (prevDir: Point, count: Int): Point =>
  pointFromRad(prevDir.polarAngle() + (Math.PI * 2) / count).times(
    prevDir.length()
  );

/**
 * @param count Can be negative for counter-clock wise
 */
export const createPolygonStep = (
  compiler: ChemCompiler,
  count: Int,
  defaultLength: Double
): Point => {
  const prevDir = getLastBond(compiler)?.dir;
  return (
    ifDef(prevDir, (it) => calcPolygonDir(it, count)) ??
    new Point(defaultLength, 0.0)
  );
};

export const parseRefsList = (
  compiler: ChemCompiler,
  value: string,
  pos: Int
): Point => {
  if (!value) {
    compiler.error("Invalid node reference '[ref]'", { ref: "", pos });
  }
  let paramPos = pos;
  const points = value.split(";").map((ref) => {
    const node = findNodeEx(compiler, ref, paramPos);
    paramPos += ref.length + 1;
    return node.pt;
  });
  const vectorSum = points.reduce((sum, vec) => sum.iadd(vec), new Point());
  const midPt = vectorSum.times(1.0 / (points.length as Double));
  // Здесь используется допущение, что перед любой универсальной связью проверяется наличие узла
  const curNode =
    compiler.curNode ?? compiler.error("Expected node before bond", { pos });
  return midPt.minus(curNode.pt);
};

export const parseAxisCoordinate = (
  compiler: ChemCompiler,
  isX: boolean,
  value: string,
  pos: Int
): Double => {
  if (!value.startsWith("#")) return parseNum(compiler, value, pos);

  const center = parseRefsList(compiler, value.slice(1), pos + 1);
  return isX ? center.x : center.y;
};

export const getLastBond = (compiler: ChemCompiler): ChemBond | undefined =>
  // compiler.curBond
  compiler.chainSys.getLastBond();

export const calcBondDirection = (
  compiler: ChemCompiler,
  params: BondParams
): Point => {
  const getLength = (): Double => {
    const it = params.L;
    return it ? parseNum(compiler, it.value, it.valuePos) : compiler.varLength;
  };

  const fromAngle = (a: Double): Point => pointFromDeg(a).times(getLength());

  const getPrevBond = (): ChemBond | undefined => getLastBond(compiler);

  const dir: Point =
    ifDef(params.p, (it) => parseRefsList(compiler, it.value, it.valuePos)) ??
    ifDef(params.P, (it) => {
      // Polygonal bond
      const n: Int =
        it.value === "" ? 5 : parseNum(compiler, it.value, it.valuePos);
      return createPolygonStep(compiler, n || 5, getLength());
    }) ??
    ifDef(params.a, (aParam) => {
      const a =
        ifDef(getPrevBond()?.dir, (it) => rad2deg(it.polarAngle())) ?? 0.0;
      return fromAngle(a + parseNum(compiler, aParam.value, aParam.valuePos));
    }) ??
    ifDef(params.A, (it) =>
      fromAngle(parseNum(compiler, it.value, it.valuePos))
    ) ??
    new Point();

  ifDef(params.x, (it) => {
    dir.x += parseAxisCoordinate(compiler, true, it.value, it.valuePos);
  });
  ifDef(params.y, (it) => {
    dir.y += parseAxisCoordinate(compiler, false, it.value, it.valuePos);
  });
  return dir;
};

const doubleBondSuffizes = { x: 1, l: 1, r: 1, m: 1 };

export const parseBondMultiplicity = (
  compiler: ChemCompiler,
  bond: ChemBond,
  param: UniBondParam
) => {
  const { value } = param;
  const getMode = (): Char => value[1]!.toLowerCase();
  if (
    value.length === 2 &&
    value[0] === "2" &&
    getMode() in doubleBondSuffizes
  ) {
    if (getMode() === "x") {
      bond.setCross();
    } else {
      bond.align = getMode();
    }
    bond.n = 2.0;
  } else if (!value) {
    bond.n = 1.0;
  } else {
    bond.n = parseNum(compiler, value, param.valuePos);
  }
};

const styleSuffixes = { m: 1, l: 1, r: 1 };

export const parseStyle = (bond: ChemBond, value: string) => {
  if (value && value[value.length - 1]!.toLowerCase() in styleSuffixes) {
    bond.align = value[value.length - 1]!.toLowerCase();
    bond.style = value.slice(0, value.length - 1);
  } else {
    bond.style = value;
  }
};

export const setBondProperties = (
  compiler: ChemCompiler,
  bond: ChemBond,
  params: BondParams
) => {
  ifDef(params.N, (it) => parseBondMultiplicity(compiler, bond, it));
  if (params.h) {
    bond.soft = true;
  }
  ifDef(params.T, (it) => {
    bond.tx = it.value;
  });
  if (bond.n === 1.0 && "H" in params) bond.setHydrogen();
  ifDef(params.C, (it) => {
    // Сoordination chemical bond
    switch (it.value) {
      case "-":
        bond.arr0 = true; // _(C-)   A<---B
        break;
      case "+": // _(C+)   A<-->B
        bond.arr0 = true;
        bond.arr1 = true;
        break;
      default: // _(C)   A--->B
        bond.arr1 = true;
        break;
    }
  });
  if (params["<"]) {
    bond.arr0 = true;
  }
  if (params[">"]) {
    bond.arr1 = true;
  }
  if (params["~"]) {
    bond.style = "~";
  }
  ifDef(params.S, (it) => parseStyle(bond, it.value));

  const setWidth = (id: string, sign: Int, isGlobal: boolean) => {
    const makePair = (): [Int | null, Int | null] => {
      switch (id) {
        case "+":
          return [0, sign];
        case "-":
          return [sign, 0];
        case "0":
        case "1":
          return [0, 0];
        case "2":
          return [sign, sign];
        default:
          return [null, null];
      }
    };
    const [first, second] = makePair();
    bond.w0 = first ?? compiler.curWidth;
    bond.w1 = second ?? compiler.curWidth;
    if (isGlobal) {
      compiler.curWidth = second ?? compiler.curWidth;
    }
    return true;
  };
  const [id, sign, isGlobal] = ifDef(params.w, (it) => [it.value, 1, false]) ??
    ifDef(params.d, (it) => [it.value, -1, false]) ??
    ifDef(params.W, (it) => [it.value, 1, true]) ??
    ifDef(params.D, (it) => [it.value, -1, true]) ?? ["", 0, false];
  setWidth(id, sign, isGlobal);
};

export const createUniversalBond = (
  compiler: ChemCompiler,
  args: string[],
  argPos: Int[]
) => {
  const bond = createCommonBond(compiler);
  if (!compiler.curNode) {
    compiler.curNode = getNodeForBondStart(compiler, bond);
  }
  const params = makeParamsDict(args, argPos);
  bond.dir = calcBondDirection(compiler, params);
  setBondProperties(compiler, bond, params);
  onOpenBond(compiler, bond);
};
