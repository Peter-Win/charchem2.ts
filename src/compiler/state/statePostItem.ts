import { CompilerState } from "../ChemCompiler";
import { getLastItem } from "../main/item";
import { scanCharge } from "../parse/scanCharge";
import { scanPostItem } from "../parse/scanPostItem";
import { stateAgentMid } from "./stateAgentMid";

export const statePostItem: CompilerState = (compiler) => {
  const item = getLastItem(compiler) ?? compiler.error("Invalid node", {});
  if (
    scanPostItem(compiler, (it) => {
      item.n = it;
    })
  )
    return compiler.setState(statePostItem);

  if (compiler.curChar() === "(") {
    const bracketPos = compiler.pos;
    compiler.pos++;
    const charge = scanCharge(compiler, false);
    if (charge && compiler.curChar() === ")") {
      item.charge = charge;
      return compiler.setState(statePostItem, 1);
    }
    compiler.pos = bracketPos;
  }

  return compiler.setState(stateAgentMid);
};
