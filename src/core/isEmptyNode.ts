import { ChemObj } from "./ChemObj";
import { ChemComment } from "./ChemComment";
import { ChemCustom } from "./ChemCustom";
import { Visitor } from "./Visitor";

export const isEmptyNode = (node: ChemObj): boolean =>
  !node.walkExt({
    isStop: false,
    atom() {
      this.isStop = true;
    },
    radical() {
      this.isStop = true;
    },
    custom(obj: ChemCustom) {
      this.isStop = !!obj.text;
    },
    comment(obj: ChemComment) {
      this.isStop = !!obj.text;
    },
  } as Visitor).isStop;
