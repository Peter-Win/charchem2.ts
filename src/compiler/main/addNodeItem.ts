import { ChemCompiler } from "../ChemCompiler";
import { ChemSubObj } from "../../core/ChemSubObj";
import { ChemNodeItem } from "../../core/ChemNodeItem";
import { getNodeForced } from "./node";
import { closeItem } from "./item";
import { getAtomColor, getItemColor } from "./colors";
import { ifDef } from "../../utils/ifDef";

export const addNodeItem = (
  compiler: ChemCompiler,
  subObj: ChemSubObj
): ChemNodeItem => {
  closeItem(compiler);
  const item = new ChemNodeItem(subObj);
  ifDef(compiler.varMass, (it) => {
    item.mass = it;
    compiler.varMass = undefined;
  });
  item.color = getItemColor(compiler);
  item.atomColor = getAtomColor(compiler);
  item.atomNum = compiler.varAtomNumber;
  item.bCenter = compiler.getAltFlag();
  item.dots = compiler.varDots;
  compiler.varDots = undefined;
  compiler.varAtomNumber = undefined;
  getNodeForced(compiler, false).items.push(item);
  return item;
};
