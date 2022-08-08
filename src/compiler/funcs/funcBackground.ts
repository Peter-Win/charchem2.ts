/**
 * Границы:
 *  Фон по-умолчанию применяется к следующему узлу, но можно указать иные узлы.
 *  Либо: весь агент
 *  фон должен захватить все указанные узлы
 *  see parseRefsList
 * Фигура: rect (default), round, ellipse
 * r (borderRadius) для rect
 * padding
 * fill
 * stroke
 * width
 * Чтобы сократить конструкции для частого использования, можно запомнить сочетание параметров, кроме nodes
 * use: name
 */

import { ChemNode } from "../../core/ChemNode";
import { ParamsChemBackground } from "../../core/ChemBackground";
import { Double, Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";
import { findNodeEx } from "../main/findNode";

export const funcBackground = (
  compiler: ChemCompiler,
  args: string[],
  pos: Int[]
) => {
  compiler.background = parseBackgroundArgs(compiler, args, pos);
};

const shapeNames = new Set(["rect", "round", "ellipse"]);

export const parseBackgroundArgs = (
  compiler: ChemCompiler,
  args: string[],
  pos: Int[]
): ParamsChemBackground => {
  const params: ParamsChemBackground = {};
  args.forEach((arg, i) => {
    const curPos = pos[i]!;
    if (arg === "*") {
      params.isAll = true;
    } else {
      const divPos = arg.indexOf(":");
      if (divPos < 0) {
        if (shapeNames.has(arg)) {
          params.shape = arg;
        } else if (!params.fill) {
          params.fill = arg;
        }
      } else {
        const key = arg.slice(0, divPos);
        const val = arg.slice(divPos + 1);
        const valPos = curPos + divPos + 1;
        switch (key) {
          case "":
          case "to":
            params.nodes = parseNodes(compiler, val, valPos);
            break;
          case "fill":
          case "f":
            params.fill = val;
            break;
          case "stroke":
          case "s":
            params.stroke = val;
            break;
          case "width":
          case "w":
            params.strokeWidth = parseNum(compiler, val, valPos);
            break;
          case "padding":
            params.padding = parsePadding(compiler, val, valPos);
            break;
          default:
            break;
        }
      }
    }
  });
  return params;
};

const parseNodes = (
  compiler: ChemCompiler,
  nodesList: string,
  pos: Int
): ChemNode[] => {
  const chunks = nodesList.split(";");
  let curPos = 0;
  return chunks.map((nodeDef) => {
    const node = findNodeEx(compiler, nodeDef, curPos + pos);
    curPos += nodeDef.length + 1;
    return node;
  });
};

const parsePadding = (
  compiler: ChemCompiler,
  values: string,
  pos: Int
): Double[] => {
  const chunks = values.split(";");
  let curPos = 0;
  return chunks.map((val) => {
    const n = parseNum(compiler, val, curPos + pos);
    curPos += val.length + 1;
    return n;
  });
};
