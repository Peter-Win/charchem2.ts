import { ChemCompiler } from "../ChemCompiler";
import { ChemObj } from "../../core/ChemObj";
import { onCloseOp } from "./chemOp";
import { onCloseAgent } from "./agent";

export const onCreateEntity = (compiler: ChemCompiler, entity: ChemObj) => {
  compiler.curEntity = entity;
  compiler.expr.entities.push(entity);
};

export const closeEntity = (compiler: ChemCompiler) => {
  if (compiler.curEntity) {
    compiler.curEntity = undefined;
    onCloseAgent(compiler);
    onCloseOp(compiler);
  }
  compiler.preComm = undefined;
};
