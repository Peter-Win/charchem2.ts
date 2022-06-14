import { ChemAtom } from "./ChemAtom";

export class Visitor {
  isStop?: boolean;

  // open fun agentPre(obj: ChemAgent) {}
  // open fun agentPost(obj: ChemAgent) {}
  atom?: (obj: ChemAtom) => void;
  // open fun bond(obj: ChemBond) {}
  // open fun bracketBegin(obj: ChemBracketBegin) {}
  // open fun bracketEnd(obj: ChemBracketEnd) {}
  // open fun comment(obj: ChemComment) {}
  // open fun custom(obj: ChemCustom) {}
  // open fun entityPre(obj: ChemObj) {}
  // open fun entityPost(obj: ChemObj) {}
  // open fun itemPre(obj: ChemNodeItem) {}
  // open fun itemPost(obj: ChemNodeItem) {}
  // open fun mul(obj: ChemMul) {}
  // open fun mulEnd(obj: ChemMulEnd) {}
  // open fun nodePre(obj: ChemNode) {}
  // open fun nodePost(obj: ChemNode) {}
  // open fun operation(obj: ChemOp) {}
  // open fun radical(obj: ChemRadical) {}
  // open fun comma(obj: ChemComma) {}
}
