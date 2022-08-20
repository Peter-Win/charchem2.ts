import { Double, Int } from "../types";
import { Point } from "../math/Point";
import { is0, toa } from "../math";
import { ChemNode } from "./ChemNode";
import { Visitor } from "./Visitor";
import { ChemObj } from "./ChemObj";
import { isNodeHidden } from "./isNodeHidden";

export type BondAlign = "x" | "r" | "m" | "l";

export class ChemBond extends ChemObj {
  n: Double = 1.0; // multiplicity of the bond

  nodes: (ChemNode | undefined)[] = [undefined, undefined];

  index?: Int; // index of bond in ChemAgent.bonds array
  // TODO: может быть нарушена в closeAgent при удалении дублирующих связей !!!

  dir?: Point; // bond vector

  tx: string = ""; // text description

  slope: Int = 0; // для связи, созданной из описания / = -1, для \ = 1, для остальных =0

  isText: boolean = false;

  color?: string; // цвет связи

  w0: Int = 0; // Толщина начала линии, 0 для обычной толщины, 1 для жирной

  w1: Int = 0; // толщина конца линии

  isAuto: boolean = false; // Признак связи, пригодной для автокоррекции

  soft: boolean = false;

  //  ~ : | I
  style: string = ""; // Строковый стиль линии. Для двойных и тройных связей каждая линия указывается отдельно

  align?: BondAlign; // Возможные режимы выравнивания двойной связи. x:перекрещенная, m:по центру, l:влево, r:вправо

  arr0: boolean = false; // Стрелка в обратную сторону

  arr1: boolean = false; // Стрелка по направлению линии

  ext: "" | "o" | "s" = ""; // for _o = 'o', for _s = 's'

  brk: boolean = false; // Устанавливается для конструкции типа -#a-#b-#c-, для связи, предшествующей существующему узлу

  isNeg: boolean = false; // Использовался символ `

  isCorr: boolean = false; // Выполнена коррекция наклона с 30 до 60 градусов

  isCycle: boolean = false; // Циклическая связь. Всегда true для _o и может быть для _s

  middlePoints?: Point[]; // Дополнительные точки для искривленных связей.
  // Если связь имеет дополнительные точки, то она не будет мержиться с другими связями между этими же узлами

  // Position calculate for second part of bond
  calcPt(): Point {
    return this.nodes[0]!.pt.plus(this.dir!);
  }

  // Get another node of bond
  other(node: ChemNode): ChemNode | undefined {
    if (this.nodes.length !== 2) return undefined;
    if (this.nodes[0] === node) return this.nodes[1];
    if (this.nodes[1] === node) return this.nodes[0];
    return undefined;
  }

  override walk(visitor: Visitor) {
    visitor.bond?.(this);
  }

  setHydrogen() {
    this.style = ":";
    this.n = 0.0;
  }

  setCross() {
    this.align = "x";
  }

  isCross() {
    return this.align === "x";
  }

  checkText() {
    // Связь считается текстовой, если она расположена горизонтально и имеет длину =1
    const { dir } = this;
    this.isText = dir ? is0(dir.y) && is0(Math.abs(dir.x) - 1) : false;
  }

  linearText(): string {
    if (this.isAuto) {
      let res: string = this.tx;
      if (this.isNeg) res = `\`${res}`;
      if (is0(this.n)) res += "0";
      return res;
    }
    return this.tx;
  }

  isHorizontal(): boolean {
    const { dir } = this;
    return dir ? !is0(dir.x) && is0(dir.y) : false;
  }

  debugText(): string {
    const bondTextStd = (it: ChemBond) =>
      `${it.nodes[0]?.index}` +
      `(${it.soft ? "~" : ""}${it.dir?.polarAngleDeg().toFixed(0)}` +
      `${it.n !== 1.0 ? `*${toa(it.n)}` : ""})` +
      `${it.nodes[1]?.index}`;

    const bondTextExt = (bond: ChemBond) =>
      `${bond.linearText()}${bond.nodes.map((it) => it?.index)}`;

    return this.nodes.length === 2 ? bondTextStd(this) : bondTextExt(this);
  }

  isVisible(): boolean {
    if (this.isVerticalConnection()) return false;
    return !is0(this.n) || !!this.style;
  }

  /**
   * Vertical connection of atoms without bond drawing.
   * Most commonly used in /N<_(y-.5)H>\ or \N<_(y.5)H/>
   */
  isVerticalConnection(): boolean {
    const { dir, nodes } = this;
    if (!dir || nodes.length !== 2) return false;
    if (!nodes[0] || isNodeHidden(nodes[0])) return false;
    if (!nodes[1] || isNodeHidden(nodes[1])) return false;
    return is0(dir.x) && is0(Math.abs(dir.y) - 0.5);
  }
}
