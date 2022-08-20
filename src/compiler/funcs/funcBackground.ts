/**
 * Границы:
 *  Фон по-умолчанию применяется к следующему узлу, но можно указать иные узлы.
 *  Либо: весь агент
 *  Если функция в конце выражения или объявляется несколько подряд, то у них нет узла и их надо указать явно.
 * фон должен захватить все указанные узлы
 * Фигура: rect (default), round, ellipse
 * r (borderRadius) для rect
 * padding
 * fill
 * stroke
 * width
 *
 * Если формула нескольео раз использует похожий набор параметров, можно использовать макрос
 */

import { ChemNode } from "../../core/ChemNode";
import {
  ChemBackground,
  ParamsChemBackground,
} from "../../core/ChemBackground";
import { Int } from "../../types";
import { ChemCompiler } from "../ChemCompiler";
import { parseNum } from "../parse/parseNum";
import { findNodeEx } from "../main/findNode";
import { parsePadding } from "../parse/parsePadding";

export const funcBackground = (
  compiler: ChemCompiler,
  args: string[],
  pos: Int[]
) => {
  if (compiler.background) {
    // Возможно указать несколько фонов подряд.
    // Тогда фоновая команда создается не дожидаясь объявления узла.
    // Само собой, нужно корректно указывать узлы.
    compiler.curAgent?.commands.push(new ChemBackground(compiler.background));
  }
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
    const argt = arg.trim();
    if (argt === "*") {
      params.isAll = true;
    } else {
      const divPos = arg.indexOf(":");
      if (divPos < 0) {
        if (shapeNames.has(argt)) {
          params.shape = argt;
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
            params.fill = val.trim();
            break;
          case "stroke":
          case "s":
            params.stroke = val.trim();
            break;
          case "width":
          case "w":
            params.strokeWidth = parseNum(compiler, val, valPos);
            break;
          case "padding":
          case "p":
            params.padding = parsePadding(compiler, val, valPos);
            break;
          case "r":
            params.borderRadius = parseNum(compiler, val, valPos);
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
