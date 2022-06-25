import { ChemCompiler, createTestCompiler } from "./ChemCompiler";
import { closeNode } from "./main/node";
import { stateAgentMid } from "./state/stateAgentMid";

export const createTestCompilerWithSingleAgent = (
  text: string
): ChemCompiler => {
  const compiler = createTestCompiler(text);
  while (!compiler.isFinish()) {
    if (compiler.curChar() === " " && compiler.curState === stateAgentMid)
      break;
    const step = compiler.curState(compiler);
    compiler.pos += step;
  }
  closeNode(compiler);
  return compiler;
};
