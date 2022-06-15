import { ChemNode } from "../ChemNode";
import { ChemNodeItem } from "../ChemNodeItem";
import { PeriodicTable } from "../PeriodicTable";
import { ChemK } from "../ChemK";
import { ChemAtom } from "../ChemAtom";
import { ChemSubObj } from "../ChemSubObj";
import { ChemRadical } from "../ChemRadical";
import { ChemComment } from "../ChemComment";

describe("ChemNode", () => {
  it("walk", () => {
    const { dict } = PeriodicTable;
    const node = new ChemNode();
    node.items.push(new ChemNodeItem(dict.C, new ChemK(2)));
    node.items.push(new ChemNodeItem(dict.H, new ChemK(5)));
    node.items.push(new ChemNodeItem(dict.O));
    node.items.push(new ChemNodeItem(dict.H));
    let res = "";
    node.walk({
      nodePre() {
        res += "[";
      },
      nodePost() {
        res += "]";
      },
      atom(obj: ChemAtom) {
        res += obj.id;
      },

      itemPost(obj: ChemNodeItem) {
        if (obj.n.isSpecified()) {
          res += obj.n;
        }
      },
    });
    expect(res).toBe("[C2H5OH]");
  });
});

describe("getCenterItem", () => {
  const { dict } = PeriodicTable;
  const createNode = (subObjects: ChemSubObj[]): ChemNode => {
    const node = new ChemNode();
    subObjects.forEach((obj, i) => {
      const item = new ChemNodeItem(obj);
      item.atomNum = i;
      node.items.push(item);
    });
    return node;
  };
  it("With cpecial center marker", () => {
    // HC`O
    const node = createNode([dict.H, dict.C, dict.O]);
    node.items[2]!.bCenter = true;
    expect(node.getCenterItem()).toHaveProperty("atomNum", 2);
  });
  it("First C element", () => {
    // HOCSC
    const node = createNode([dict.H, dict.O, dict.C, dict.S, dict.C]);
    expect(node.getCenterItem()).toHaveProperty("atomNum", 2);
  });
  it("First non-H element", () => {
    // HOEt
    const node = createNode([dict.H, dict.O, ChemRadical.dict.Et!]);
    expect(node.getCenterItem()).toHaveProperty("atomNum", 1);
  });
  it("H + Radical", () => {
    // HEt
    const node = createNode([dict.H, ChemRadical.dict.Et!]);
    expect(node.getCenterItem()).toHaveProperty("atomNum", 1);
  });
  it("Chem comment + H", () => {
    const node = createNode([dict.H, new ChemComment("(g)")]);
    expect(node.getCenterItem()).toHaveProperty("atomNum", 0);
  });
});
