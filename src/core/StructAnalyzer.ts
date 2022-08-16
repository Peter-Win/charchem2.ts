import { cmp } from "../utils/cmp";
import { getItemForced } from "../utils/getItemForced";
import { ifDef } from "../utils/ifDef";
import { Point } from "../math/Point";
import { ChemAgent } from "./ChemAgent";
import { ChemBond } from "./ChemBond";
import { ChemNode } from "./ChemNode";

export interface Cycle {
  nodes: ChemNode[];
  bonds: ChemBond[];
  center?: Point;
}

export const getCycleCenter = (cy: Cycle): Point => {
  if (cy.center) return cy.center;
  const L = cy.nodes.length;
  const center =
    L === 0
      ? new Point()
      : cy.nodes
          .reduce((sum, node) => sum.iadd(node.pt), new Point())
          .times(1 / L);
  // eslint-disable-next-line no-param-reassign
  cy.center = center;
  return center;
};

const vectorSign = (p: Point, q: Point): -1 | 0 | 1 => {
  const d = p.x * q.y - p.y * q.x;
  if (d === 0) return 0;
  return d < 0 ? -1 : 1;
};

/**
 * @param cycle
 * @param bond
 * @returns -1 for CCW and 1 for CW or 0 if undefined
 */
export const calcBondSign = (cycle: Cycle, bond: ChemBond): -1 | 0 | 1 => {
  const a = bond.nodes[0]?.pt;
  const b = bond.nodes[1]?.pt;
  if (!a || !b) return 0;
  const c = getCycleCenter(cycle);
  return vectorSign(b.minus(a), c.minus(a));
};

export const bondSideSign = (bond: ChemBond, side: 0 | 1): -1 | 0 | 1 => {
  const node = bond.nodes[side];
  if (!node || !bond.dir) return 0;
  const nearBonds = Array.from(node.bonds).filter(
    (b) => b !== bond && b.isVisible() && b.dir
  );
  if (nearBonds.length !== 1) return 0;
  return vectorSign(bond.dir, nearBonds[0]!.dir!);
};

export class StructAnalyzer {
  isInit: boolean = false;

  cycles: Cycle[] = [];

  bondsMap: Record<number, Cycle[]> = {};

  constructor(public readonly agent: ChemAgent) {}

  analyze() {
    if (this.isInit) return;
    this.isInit = true;
    interface NodeDef {
      node: ChemNode;
      order: number;
    }
    const { nodes, bonds } = this.agent;
    if (bonds.length < 3) return;
    const NA = nodes.length * 2;
    const nodesMap: NodeDef[] = nodes.map((node) => ({ node, order: NA }));

    const unwindCycle = (start: NodeDef, usedNodes: Set<number>): Cycle => {
      // Набор usedNodes предотвращает переходы в ответвления. И ограничивает поиск.
      const queue: NodeDef[] = [start];
      const cycle: Cycle = { nodes: [], bonds: [] };
      let lastBond: ChemBond | undefined;
      const nodesSet = new Set<ChemNode>();
      for (;;) {
        const curND = queue.shift();
        if (!curND) break;
        nodesSet.add(curND.node);
        // eslint-disable-next-line
        curND.node.bonds.forEach((bond) => {
          const nextNode = bond.other(curND.node);
          if (nextNode) {
            const i = nextNode.index!;
            const nextND = nodesMap[i]!;
            if (usedNodes.has(i)) {
              if (curND.order + 1 === nextND.order) {
                queue.push(nextND);
                cycle.bonds.push(bond);
              } else if (curND.order === nextND.order) {
                lastBond = bond;
              }
            }
          }
        });
      }
      if (lastBond) cycle.bonds.push(lastBond);
      cycle.nodes = Array.from(nodesSet);
      cycle.nodes.sort((a, b) => cmp(a.index!, b.index!));
      cycle.bonds.sort((a, b) => cmp(a.index!, b.index!));
      return cycle;
    };

    const createCycle = (n1: NodeDef, n2: NodeDef): Cycle | undefined => {
      if (n2.order > n1.order) throw new Error("Invalid order");
      // Необходимо выполнить сканирование в обратном порядке, чтобы найти начало цикла
      // Это гарантировано будет один узел.
      const queue: NodeDef[] = [n1];
      // Для циклов с нечетным числом узлов на стыке будет два узла с одинаковым порядком
      if (n2.order === n1.order) queue.push(n2);
      const usedNodes = new Set<number>();
      for (;;) {
        const curND = queue.shift();
        if (!curND) break;
        const i = curND.node.index!;
        if (usedNodes.has(i)) {
          // Найдено начало цикла
          // Теперь нужно собрать все узлы и связи цикла. И избавиться от боковых ответвлений.
          return unwindCycle(curND, usedNodes);
        }
        usedNodes.add(i);
        curND.node.bonds.forEach((bond) => {
          const nextNode = bond.other(curND.node);
          if (nextNode) {
            const nextND = nodesMap[nextNode.index!]!;
            if (nextND.order + 1 === curND.order) {
              queue.push(nextND);
            }
          }
        });
      }
      return undefined;
    };

    const scan = (start: NodeDef) => {
      if (start.order !== NA) return;
      // eslint-disable-next-line no-param-reassign
      start.order = 0;
      const queue: NodeDef[] = [start];
      const cyBonds = new Set<number>();
      for (;;) {
        const curND = queue.shift();
        if (!curND) break;
        curND.node.bonds.forEach((bond) => {
          const nextNode = bond.other(curND.node);
          if (nextNode) {
            const nextND = nodesMap[nextNode.index]!;
            const nextOrder = nextND.order;
            if (nextOrder === NA) {
              // Этот узел еще не вставал в очередь
              nextND.order = curND.order + 1;
              queue.push(nextND);
            } else if (nextOrder >= curND.order) {
              // Цикл создается если порядок след. узла не меньше, чем порядок предыдущего
              if (!cyBonds.has(bond.index!)) {
                // Необходимо предотвратить повторную обработку цикла.
                // Актуально для циклов с нечетным числом узлов.
                cyBonds.add(bond.index!);
                const c = createCycle(nextND, curND);
                if (c) this.cycles.push(c);
              }
            }
          }
        });
      }
    };
    // Необходимо пройти по всем узлам, т.к. не гарантируется, что все узлы агента в одной цепи.
    // Поэтому сканирование не обязательно обходит все узлы.
    nodesMap.forEach((nodeDef) => scan(nodeDef));

    this.cycles.forEach((cy) => {
      cy.bonds.forEach((bond) => {
        const { index } = bond;
        if (typeof index === "number") {
          const list = getItemForced(this.bondsMap, index, []);
          list.push(cy);
        }
      });
    });
  }

  findCyclesForBond(bond: ChemBond): Cycle[] {
    this.analyze();
    return ifDef(bond.index, (i) => this.bondsMap[i]) ?? [];
  }

  calcBondSign(bond: ChemBond): -1 | 0 | 1 {
    const c0 = this.findCyclesForBond(bond)[0];
    if (c0) return calcBondSign(c0, bond);
    const sFwd = bondSideSign(bond, 1);
    const sBkw = bondSideSign(bond, 0);
    if ((sFwd === -1 && sBkw !== -1) || (sFwd === 0 && sBkw === 1)) return -1;
    if ((sFwd === 1 && sBkw !== 1) || (sFwd === 0 && sBkw === -1)) return 1;
    return 0;
  }
}
