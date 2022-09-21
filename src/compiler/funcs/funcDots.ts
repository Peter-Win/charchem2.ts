import { LewisDot } from "../../core/ChemNodeItem";
import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";

/*
 1. Compatible for ver 0.0
  UTDBLRutdblr for pairs of points top, bottom, left and right
  ! = all 8 positions
  (L) = :O, (Lb) = .O, (R) = O:, (LR) = :O:, (LbRb) = .O., (T) = (U) = Ö 
  LR = !UD
 2. Compatible for 1.0
  List of angles
  (22,-22) = O:
 3. Features of 2.0:
  - using colors: $dots(c:red,UD) or $dots(c:blue,22,-22)
  - using combination of different parameters: (c:green,T,c:red,180)
*/

// Цвета по приоритетности (при отрисовке): цвет точки, цвет атома, цвет элемента, дефолтный цвет

const rxCompact = /^!?([LR][dbtu]?|[UTDB][lr]?)+$/;

export const splitDotPositions = (descr: string): number[] => {
  //    5  6  U=T
  // L 4 ## 7  R
  //   3 ## 0
  //    2  1  B=D
  // if (descr === "!") return [0, 1, 2, 3, 4, 5, 6, 7];
  const result: number[] = [];
  const isRev = descr[0] === "!";
  let i = isRev ? 1 : 0;
  const check2 = (match: string, n: number) => {
    if (match.indexOf(descr[i]!) >= 0) {
      result.push(n);
      i++;
      return true;
    }
    return false;
  };
  const checkEx = (m1: string, n1: number, m2: string, n2: number): void => {
    // eslint-disable-next-line no-unused-expressions
    check2(m1, n1) || check2(m2, n2) || result.push(n1, n2);
  };
  while (i < descr.length) {
    const c = descr[i++];
    if (c === "R") {
      checkEx("db", 0, "tu", 7);
    } else if (c === "L") {
      checkEx("db", 3, "tu", 4);
    } else if (c === "U" || c === "T") {
      checkEx("l", 5, "r", 6);
    } else if (c === "B" || c === "D") {
      checkEx("r", 1, "l", 2);
    }
  }
  if (!isRev) {
    return result;
  }
  const revSet = result.reduce((acc, n) => {
    acc.delete(n);
    return acc;
  }, new Set([0, 1, 2, 3, 4, 5, 6, 7]));
  return Array.from(revSet);
};

interface ResDotArgDirs {
  cmd: "dirs";
  dirs: number[]; // directions from 0 to 7
}
interface ResDotArgNum {
  cmd: "num";
  num: number;
}
interface ResDotArgColor {
  cmd: "color";
  color?: string;
}
interface ResDotArgMargin {
  cmd: "margin";
  margin?: number;
}
type ResDotArg =
  | ResDotArgDirs
  | ResDotArgNum
  | ResDotArgColor
  | ResDotArgMargin;

export const parseSingleDotArg = (
  compiler: ChemCompiler,
  arg: string,
  pos: Int
): ResDotArg | undefined => {
  if (!arg) return undefined;
  if (arg.startsWith("c:") || arg.startsWith("color:")) {
    const color = arg.slice(arg.indexOf(":") + 1);
    return { cmd: "color", color: color || undefined };
  }
  if (arg.startsWith("m:") || arg.startsWith("margin:")) {
    const val = arg.slice(arg.indexOf(":") + 1);
    const margin = val ? parseNum(compiler, val, pos) : undefined;
    return { cmd: "margin", margin };
  }
  if (arg === "!" || rxCompact.test(arg)) {
    return { cmd: "dirs", dirs: splitDotPositions(arg) };
  }
  return { cmd: "num", num: parseNum(compiler, arg, pos) };
};

export const parseDotsArgs = (
  compiler: ChemCompiler,
  args: string[],
  pos: Int[]
): LewisDot[] => {
  const dots: LewisDot[] = [];
  let color: string | undefined;
  let margin: number | undefined;
  const params = () => {
    const res: { color?: string; margin?: number } = {};
    if (color) res.color = color;
    if (margin) res.margin = margin;
    return res;
  };
  const addAngle = (angle: number) => {
    dots.push({ ...params(), angle });
  };
  const addPos = (dotPos: number) => {
    dots.push({ ...params(), pos: dotPos });
  };
  args.forEach((arg, i) => {
    const r: ResDotArg | undefined = parseSingleDotArg(compiler, arg, pos[i]!);
    switch (r?.cmd) {
      case "dirs":
        r.dirs.forEach((dir) => addPos(dir));
        break;
      case "num":
        addAngle(r.num);
        break;
      case "color":
        color = r.color;
        break;
      case "margin":
        margin = r.margin;
        break;
      default:
        break;
    }
  });
  return dots;
};

export const funcDots = (
  compiler: ChemCompiler,
  args: string[],
  pos: Int[]
) => {
  const dots: LewisDot[] = parseDotsArgs(compiler, args, pos);
  compiler.varDots = dots;
};
