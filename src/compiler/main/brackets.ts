/*

Скобки вкладываются совместно с ветками. То есть, если открыта ветка, а в ней скобка,
то сначала закрывается скобка, а потом ветка.

У скобок могут быть входящая и исходящая связь, но не обязательно.
(NH4)2SO4 - нет связей

H-(CH2)4-H - Есть обе связи. Причем они мягкие. Поэтому рисуются не к узлу, а к скобке.

H^+_(x1.4,N0)[Cu^+<`|hBr^-><|hBr^->]^-
     +  Br +
     |  |  |
  H--|--Cu |
     |  |  |
     +  Br +
Здесь есть только входящая связь, соединяющая узел снаружи и внутри скобки

Кроме того, если после скобок объявить ветки, то можно сделать несколько исходящих связей.
 */
import { Int } from "../../types";
import { StackItem } from "./StackItem";
import { ChemBracketBegin, ChemBracketEnd } from "../../core/ChemBracket";
import { ChemCompiler } from "../ChemCompiler";
import { ChemNode } from "../../core/ChemNode";
import { openBranch } from "./branch";
import { closeNode, openNode } from "./node";
import { ChemMulEnd } from "../../core/ChemMul";
import { lastItem } from "../../utils/lastItem";
import { ifDef } from "../../utils/ifDef";
import { checkMulBeforeBracket } from "./multipier";
import { scanPostItem } from "../parse/scanPostItem";
import { stateAgentMid } from "../state/stateAgentMid";
import { stateBracketBegin } from "../state/stateBracketBegin";

class BracketDecl extends StackItem {
  constructor(pos: Int, public readonly begin: ChemBracketBegin) {
    super(pos);
  }

  // eslint-disable-next-line class-methods-use-this
  override msgInvalidClose(): string {
    return "It is necessary to close the bracket";
  }
}

export const openParentheses = (compiler: ChemCompiler): Int => {
  // Здесь возможны следующие случаи
  // - (* - открыть ветку
  // - скобка для конструкций типа Ca(OH)2

  // * степень окисления текущего элемента узла тоже в круглых скобках,
  // но допустимо только после описания элемента. Поэтому см statePostItem
  compiler.pos++;
  if (compiler.curChar() === "*") {
    return openBranch(compiler);
  }
  openBracket(compiler, "(", compiler.pos - 1);
  return compiler.setState(stateBracketBegin);
};

export const openSquareBracket = (compiler: ChemCompiler): Int => {
  openBracket(compiler, "[", compiler.pos++);
  return compiler.setState(stateBracketBegin);
};

const openBracket = (compiler: ChemCompiler, text: string, pos: Int) => {
  const begin = new ChemBracketBegin(text);
  begin.color = compiler.varColor;
  compiler.mulCounter.onOpenBracket();
  compiler.curAgent!.commands.push(begin);
  compiler.push(new BracketDecl(pos, begin));
  if (compiler.curBond != null) {
    begin.bond = compiler.curBond;
  } else {
    closeNode(compiler);
  }
};

const bracketPairs: Record<string, string> = { "(": ")", "[": "]" };

export const getNodeForBracketEnd = (compiler: ChemCompiler): ChemNode => {
  const { curNode } = compiler;
  if (curNode) {
    return curNode;
  }
  const { commands } = compiler.curAgent!;
  let lastCmd = lastItem(commands);
  if (lastCmd instanceof ChemMulEnd) {
    lastCmd = commands[commands.length - 2];
  }
  if (lastCmd instanceof ChemBracketEnd) {
    return lastCmd.nodeIn;
  }
  return openNode(compiler, true);
};

export const closeBracket = (
  compiler: ChemCompiler,
  text: string,
  pos: Int
): ChemBracketEnd =>
  ifDef(compiler.pop(), (decl) => {
    if (decl instanceof BracketDecl) {
      const needCloseText: string =
        bracketPairs[decl.begin.text] ??
        // Такая ошибка не должна возникнуть, если правильно заполнен словарь bracketPairs
        compiler.error("Invalid bracket pair [s]", {
          s: decl.begin.text + text,
        });
      if (needCloseText !== text) {
        // Тип открытой скобки должен соответствовать типу закрытой
        compiler.error("Expected [must] instead of [have]", {
          must: needCloseText,
          have: text,
          pos,
          pos0: decl.pos,
        });
      }

      checkMulBeforeBracket(compiler);
      compiler.mulCounter.onCloseBracket();
      const bracketEnd = new ChemBracketEnd(
        text,
        decl.begin,
        getNodeForBracketEnd(compiler)
      );
      const { commands } = compiler.curAgent!;
      commands.push(bracketEnd);
      decl.begin.end = bracketEnd;
      closeNode(compiler);
      compiler.chargeOwner = bracketEnd;
      return bracketEnd;
    }
    return compiler.error("Cant close bracket before branch", {
      pos,
      pos0: decl.pos + 1,
    });
  }) ?? compiler.error("Invalid bracket close", { pos });

export const closeBracketShort = (compiler: ChemCompiler): Int => {
  const end = closeBracket(compiler, compiler.curChar(), compiler.pos++);
  scanPostItem(compiler, (it) => {
    end.n = it;
  });
  return compiler.setState(stateAgentMid);
};
