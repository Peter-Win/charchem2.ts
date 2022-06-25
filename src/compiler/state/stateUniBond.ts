import { CompilerState } from "../ChemCompiler";
import { createPolygonalBond } from "../main/bondPolygonal";
import { createRingBond } from "../main/bondRing";
import { createSplineBond } from "../main/bondSpline";
import { createUniversalBond } from "../main/bondUniversal";
import { createMiddlePoint } from "../main/middlePoint";
import { scanArgs } from "../parse/scanArgs";
import { stateAgentMid } from "./stateAgentMid";

export const stateUniBond: CompilerState = (compiler) => {
  switch (compiler.curChar()) {
    case "(":
      {
        compiler.pos++;
        const { args, argPos } = scanArgs(compiler);
        createUniversalBond(compiler, args, argPos);
      }
      break;
    case "p":
    case "q":
      createPolygonalBond(compiler);
      break;
    case "m":
      createMiddlePoint(compiler);
      break;
    case "o":
      createRingBond(compiler, 1);
      break;
    case "s":
      createSplineBond(compiler);
      break;
    default:
      createUniversalBond(compiler, [], []);
      break;
  }
  return compiler.setState(stateAgentMid);
};
