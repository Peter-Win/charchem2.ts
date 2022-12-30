import { CoeffPosOrAngle } from "../types/CoeffPos";
import { Int, Double, Char } from "../types";
import { LangParams } from "../lang/Lang";
import { ChemAgent } from "../core/ChemAgent";
import { ChemNode } from "../core/ChemNode";
import { LewisDot } from "../core/ChemNodeItem";
import { ChemExpr } from "../core/ChemExpr";
import { ChemObj } from "../core/ChemObj";
import { ChemOp } from "../core/ChemOp";
import { BondAlign, ChemBond } from "../core/ChemBond";
import { ChemChargeOwner } from "../core/ChemChargeOwner";
import { ChemComment } from "../core/ChemComment";
import { ChemError } from "../core/ChemError";

import { ChainSys } from "./ChainSys";
import { MiddlePoint } from "./types";
import { MulCounter } from "./main/MulCounter";
import { NodesBranch } from "./main/NodesBranch";
import { StackItem } from "./main/StackItem";

import { stateBegin } from "./state/stateBegin";
import { prepareText } from "./parse/prepareText";
import { BracketsCtrl } from "./main/BracketsCtrl";
import { ParamsChemBackground } from "../core/ChemBackground";
import { ChemCompilerOptions } from "./ChemCompilerOptions";
import { SrcMapItem } from "./sourceMap/SrcMapItem";

export type CompilerState = (c: ChemCompiler) => Int;

export class ChemCompiler {
  readonly srcText: string;

  readonly options: ChemCompilerOptions;

  constructor(srcText: string, options?: ChemCompilerOptions) {
    this.srcText = srcText;
    this.options = options ?? {};
    if (this.options.srcMap) {
      this.srcMap = [];
      this.expr.srcMap = this.srcMap;
    }
  }

  readonly expr = new ChemExpr();

  text = "";

  pos = 0;

  srcMap?: SrcMapItem[];

  curState: CompilerState = stateBegin;

  curEntity?: ChemObj;

  curOp?: ChemOp;

  curAgent?: ChemAgent;

  curNode?: ChemNode;

  curBond?: ChemBond;

  chargeOwner?: ChemChargeOwner; // Объект, к которому применится конструкция ^

  curPart: Int = 0;

  elementStartPos: Int = 0;

  preComm?: ChemComment;

  preCommPos?: number;

  readonly chainSys = new ChainSys(this);

  references: Record<string, ChemNode> = {};

  readonly mulCounter: MulCounter = new MulCounter();

  readonly varsDict: Record<string, Double> = {};

  curWidth = 0;

  readonly nodesBranch = new NodesBranch();

  readonly bracketsCtrl = new BracketsCtrl();

  readonly middlePoints: MiddlePoint[] = [];

  private readonly stack: StackItem[] = [];

  background?: ParamsChemBackground;

  push(item: StackItem) {
    this.stack.unshift(item);
  }

  pop(): StackItem | undefined {
    return this.stack.shift();
  }

  private altFlag: boolean = false;

  setAltFlag() {
    this.altFlag = true;
  }

  getAltFlag(): boolean {
    const value = this.altFlag;
    this.altFlag = false;
    return value;
  }

  varSlope: Double = 0.0;

  varLength: Double = 1.0;

  varMass?: Double; // special mass for next element - $M()

  varAtomNumber?: Int; // number in $nM(mass, number)

  varColor?: string;

  varItemColor?: string;

  varItemColor1?: string;

  varAtomColor?: string;

  varAtomColor1?: string;

  varAlign?: BondAlign;

  varPadding: number[] = [];

  centralNode: boolean = false;

  varDots?: LewisDot[] = undefined;

  varPos?: CoeffPosOrAngle = undefined;

  entityBegin?: number;

  eject<K extends "varPos" | "varDots" | "entityBegin" | "preCommPos">(
    key: K
  ): ChemCompiler[K] {
    const v = this[key];
    this[key] = undefined;
    return v;
  }

  curChar(): Char {
    return this.text[this.pos]!;
  }

  nextChar(): Char {
    return this.text[this.pos + 1]!;
  }

  subStr(startPos: Int): string {
    return this.text.slice(startPos, this.pos);
  }

  isFinish(): boolean {
    return this.pos >= this.text.length;
  }

  /**
   * Специальная функция сравнения, соответствует ли указанная строка value
   * содержимому text, начиная с позиции pos
   */
  isCurPosEq(value: string): boolean {
    return (
      value ===
      this.text.slice(
        this.pos,
        Math.min(this.text.length, this.pos + value.length)
      )
    );
  }

  // eslint-disable-next-line class-methods-use-this
  error(msgId: string, params: LangParams): never {
    const newParams = { ...params };
    const { pos } = newParams;
    if (typeof pos === "number") {
      newParams.pos = pos + 1;
    }
    throw new ChemError(msgId, newParams);
  }

  setState(newState: CompilerState, deltaPos: Int = 0): Int {
    this.curState = newState;
    return deltaPos;
  }

  addSrcMapItem(obj: ChemObj, begin?: number) {
    const { srcMap, pos: end } = this;
    if (begin !== undefined && srcMap) {
      srcMap.push({ begin, end, obj });
    }
  }
}

export const createTestCompiler = (text: string): ChemCompiler => {
  const compiler = new ChemCompiler(text);
  prepareText(compiler);
  return compiler;
};
