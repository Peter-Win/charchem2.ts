import { isEmptyNode } from "../isEmptyNode";
import { ChemSubObj } from "../ChemSubObj";
import { ChemNode } from "../ChemNode";
import { ChemNodeItem } from "../ChemNodeItem";
import { PeriodicTable } from "../PeriodicTable";
import { ChemCustom } from "../ChemCustom";
import { ChemComment } from "../ChemComment";

it("isEmptyNode", () => {
  const makeNode = (subObj: ChemSubObj): ChemNode => {
    const node = new ChemNode();
    node.items.push(new ChemNodeItem(subObj));
    return node;
  };
  expect(isEmptyNode(makeNode(PeriodicTable.dict.H))).toBe(false);
  expect(isEmptyNode(makeNode(new ChemCustom("R")))).toBe(false);
  expect(isEmptyNode(makeNode(new ChemCustom("")))).toBe(true);
  expect(isEmptyNode(makeNode(new ChemComment("Text")))).toBe(false);
  expect(isEmptyNode(makeNode(new ChemComment("")))).toBe(true);
});
