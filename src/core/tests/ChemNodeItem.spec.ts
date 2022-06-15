import { ChemNodeItem } from "../ChemNodeItem";
import { PeriodicTable } from "../PeriodicTable";
import { ChemK } from "../ChemK";
import { ChemAtom } from "../ChemAtom";

describe("ChemNodeItem", () => {
  it("walk", () => {
    const item = new ChemNodeItem(PeriodicTable.dict.Li, new ChemK(2));
    let res = "";
    item.walk({
      itemPre() {
        res += "<<";
      },

      itemPost(obj: ChemNodeItem) {
        res += obj.n;
        res += ">>";
      },

      atom(obj: ChemAtom) {
        res += obj.id;
      },
    });
    expect(res).toBe("<<Li2>>");
  });
});
