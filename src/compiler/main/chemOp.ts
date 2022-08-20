import { ChemCompiler } from "../ChemCompiler";
import { ChemOp } from "../../core/ChemOp";
import { closeEntity, onCreateEntity } from "./entity";

export class OpDef {
  constructor(
    public readonly src: string,
    public readonly dst: string | null = null,
    public readonly div: boolean = false
  ) {}

  opCode() {
    return this.dst ?? this.src;
  }
}

export const opsList: OpDef[] = [
  new OpDef("+"),
  new OpDef("-->", "—→", true),
  new OpDef("--|>", "—→", true),
  new OpDef("->", "→", true),
  new OpDef("®", "→", true),
  new OpDef("→", null, true),
  new OpDef("=", null, true),
  new OpDef("↔", null, true),
  new OpDef("<->", "↔", true),
  new OpDef("<=>", "\u21CC", true),
  new OpDef("<==>", "\u21CC", true),
  new OpDef("*", "∙"),
  new OpDef("!=", "≠", true),
];

export const onCloseOp = (compiler: ChemCompiler) => {
  compiler.curOp = undefined;
};

export const createChemOp = (compiler: ChemCompiler, def: OpDef) => {
  const { preComm } = compiler;
  closeEntity(compiler);
  const op = new ChemOp(def.src, def.opCode(), def.div);
  op.color = compiler.varColor;
  op.commentPre = preComm;
  onCreateEntity(compiler, op);
  compiler.curOp = op;
  if (def.div) {
    compiler.curPart++;
  }
};
