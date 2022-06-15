import { ChemAtom } from "./ChemAtom";
import { ChemNodeItem } from "./ChemNodeItem";
import { ChemNode } from "./ChemNode";
import { ChemComment } from "./ChemComment";
import { ChemCustom } from "./ChemCustom";
import { ChemRadical } from "./ChemRadical";
import { ChemBond } from "./ChemBond";
import { ChemAgent } from "./ChemAgent";
import { ChemBracketBegin, ChemBracketEnd } from "./ChemBracket";
import { ChemComma } from "./ChemComma";
import { ChemMul, ChemMulEnd } from "./ChemMul";
import { ChemOp } from "./ChemOp";
import { ChemObj } from "./ChemObj";

export interface Visitor {
  isStop?: boolean;

  agentPre?: (obj: ChemAgent) => void;
  agentPost?: (obj: ChemAgent) => void;
  atom?: (obj: ChemAtom) => void;
  bond?: (obj: ChemBond) => void;
  bracketBegin?: (obj: ChemBracketBegin) => void;
  bracketEnd?: (obj: ChemBracketEnd) => void;
  comment?: (obj: ChemComment) => void;
  custom?: (obj: ChemCustom) => void;
  entityPre?: (obj: ChemObj) => void;
  entityPost?: (obj: ChemObj) => void;
  itemPre?: (obj: ChemNodeItem) => void;
  itemPost?: (obj: ChemNodeItem) => void;
  mul?: (obj: ChemMul) => void;
  mulEnd?: (obj: ChemMulEnd) => void;
  nodePre?: (obj: ChemNode) => void;
  nodePost?: (obj: ChemNode) => void;
  operation?: (obj: ChemOp) => void;
  radical?: (obj: ChemRadical) => void;
  comma?: (obj: ChemComma) => void;
}
