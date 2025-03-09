import { compile } from "../compile";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { textFormula } from "../../textBuilder/textFormula";
import { lastItem } from "../../utils/lastItem";

describe("chains", () => {
  it("TwoSubChains", () => {
    const expr = compile("H3C-OH");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(2);
    expect(agent.bonds).toHaveLength(1);
    expect(agent.bonds[0]!.soft).toBe(true);
    const [left, right] = agent.nodes;
    expect(left!.chain).toBe(right!.chain);
    expect(left!.chain).not.toBe(0);
    expect(left!.subChain).not.toBe(0);
    expect(left!.subChain).not.toBe(right!.subChain);
    expect(left!.pt.toString()).toBe("(0, 0)");
    expect(right!.pt.toString()).toBe("(0, 0)");
  });
  it("SingleSubChainForPseudoSoftBonds", () => {
    const expr = compile("`-`-");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(3);
    expect(agent.bonds).toHaveLength(2);
    expect(agent.bonds[0]!.soft).toBe(false);
    expect(agent.bonds[1]!.soft).toBe(false);
    const [a, b, c] = agent.nodes;
    expect(a!.chain).not.toBe(0);
    expect(a!.subChain).not.toBe(0);
    expect(a!.chain).toBe(b!.chain);
    expect(b!.chain).toBe(c!.chain);
    expect(a!.subChain).toBe(b!.subChain);
    expect(b!.subChain).toBe(c!.subChain);
    expect(a!.pt.toString()).toBe("(0, 0)");
    expect(b!.pt.toString()).toBe("(-1, 0)");
    expect(c!.pt.toString()).toBe("(-2, 0)");
  });
  it("DifferentChains", () => {
    const expr = compile("H-Cl; H2O");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(3);
    expect(agent.bonds).toHaveLength(1);
    const [a, b, c] = agent.nodes;
    expect(a!.chain).toBe(b!.chain);
    expect(b!.chain).not.toBe(c!.chain);
    expect(a!.subChain).not.toBe(b!.subChain);
    expect(b!.subChain).not.toBe(c!.subChain);
    expect(a!.pt.toString()).toBe("(0, 0)");
    expect(b!.pt.toString()).toBe("(0, 0)");
    expect(c!.pt.toString()).toBe("(0, 0)");
  });
  it("ChainsMerge", () => {
    //      d
    //      |
    //  a---b---c
    //      |
    //      e
    const expr = compile("H-C-H; H|#2|H");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(5);
    const [a, b, c, d, e] = agent.nodes;
    // Все узлы в одной цепи
    expect(a!.chain).toBe(b!.chain);
    expect(b!.chain).toBe(c!.chain);
    expect(c!.chain).toBe(d!.chain);
    expect(d!.chain).toBe(e!.chain);
    // Подцепи: a, b-d-e, c
    expect(a!.subChain).not.toBe(b!.subChain);
    expect(b!.subChain).not.toBe(c!.subChain);
    expect(b!.subChain).toBe(d!.subChain);
    expect(b!.subChain).toBe(e!.subChain);
  });
  it("MergeSubChainsFromSameChain", () => {
    // a---b
    //     |
    // d---c
    const expr = compile("{A}-{B}|{C}`-{D}`|#1");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(makeBrutto(expr), "text")).toBe("ABCD");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(4);
    const [a, b, c, d] = agent.nodes;
    // All nodes in same chain
    expect(a!.chain).toBe(b!.chain);
    expect(b!.chain).toBe(c!.chain);
    expect(c!.chain).toBe(d!.chain);
    // 3 sub chains: a, b-c, d
    expect(a!.subChain).not.toBe(b!.subChain);
    expect(b!.subChain).toBe(c!.subChain);
    expect(c!.subChain).not.toBe(d!.subChain);
    expect(d!.subChain).not.toBe(a!.subChain);
    expect(a!.pt.toString()).toBe("(0, 0)");
    expect(b!.pt.toString()).toBe("(0, 0)");
    expect(c!.pt.toString()).toBe("(0, 1)");
    expect(d!.pt.toString()).toBe("(0, 0)");
    // last bond is transition
    expect(lastItem(agent.bonds)!.dir).toBeUndefined();
  });
  it("MergeSubChainsWithSoftBond", () => {
    // N
    // |
    // B<--K
    // |   |
    // C-~-F
    const expr = compile("B|C-F`|K`-#1`|N");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(makeBrutto(expr), "text")).toBe("CBFKN");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(5);
    const [b, c, f, k, n] = agent.nodes;
    // Цепь у всех узлов одинаковая
    expect(b!.chain).toBe(c!.chain);
    expect(c!.chain).toBe(f!.chain);
    expect(f!.chain).toBe(k!.chain);
    expect(k!.chain).toBe(n!.chain);
    // Должно быть две подцепи b-c-n и f-k
    expect(b!.subChain).toBe(c!.subChain);
    expect(c!.subChain).toBe(n!.subChain);
    expect(c!.subChain).not.toBe(f!.subChain);
    expect(f!.subChain).toBe(k!.subChain);

    expect(b!.pt.toString()).toBe("(0, 0)");
    expect(c!.pt.toString()).toBe("(0, 1)");
    expect(f!.pt.toString()).toBe("(0, 0)");
    expect(k!.pt.toString()).toBe("(0, -1)");
    expect(n!.pt.toString()).toBe("(0, -1)");
    // Связь между k и b выполняет переход от одной подцепи к другой
    const bondKB = expr.getAgents()[0]!.bonds[3]!;
    expect(bondKB.nodes[0]).toBe(k);
    expect(bondKB.nodes[1]).toBe(b);
    expect(bondKB.dir).toBeUndefined();
  });
  it("EthanVertical", () => {
    // Сложный случай. В версии 0.8 ошибка в отрисовке связи 4-5
    // В версии 1.0 ошибка в отрисовке связи 2|5
    //     7           6       y-2
    //     |           |
    // 1---2---3   0---1---2   y-1
    //     |           |
    // 4---5---6   3---4---5   y0
    //     |           |
    //     8           7       y1
    const expr = compile("H-C-H; H-C-H; H|#2|#5|H");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(makeBrutto(expr), "text")).toBe("C2H6");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(8);
    expect(agent.bonds).toHaveLength(7);
    const n = agent.nodes;
    expect(n[0]!.chain).toBe(n[1]!.chain);
    expect(n[1]!.chain).toBe(n[2]!.chain);
    expect(n[2]!.chain).toBe(n[3]!.chain);
    expect(n[3]!.chain).toBe(n[4]!.chain);
    expect(n[4]!.chain).toBe(n[5]!.chain);
    expect(n[5]!.chain).toBe(n[6]!.chain);
    expect(n[6]!.chain).toBe(n[7]!.chain);
    expect(n[0]!.subChain).not.toBe(n[1]!.subChain);
    expect(n[1]!.subChain).not.toBe(n[2]!.subChain);
    expect(n[2]!.subChain).not.toBe(n[3]!.subChain);
    expect(n[3]!.subChain).not.toBe(n[4]!.subChain);
    expect(n[4]!.subChain).not.toBe(n[5]!.subChain);
    expect(n[5]!.subChain).not.toBe(n[6]!.subChain);
    expect(n[6]!.subChain).toBe(n[1]!.subChain);
    expect(n[1]!.subChain).toBe(n[4]!.subChain);
    expect(n[4]!.subChain).toBe(n[7]!.subChain);
    expect(n[0]!.pt.toString()).toBe("(0, 0)");
    expect(n[1]!.pt.toString()).toBe("(0, -1)");
    expect(n[2]!.pt.toString()).toBe("(0, 0)");
    expect(n[3]!.pt.toString()).toBe("(0, 0)");
    expect(n[4]!.pt.toString()).toBe("(0, 0)");
    expect(n[5]!.pt.toString()).toBe("(0, 0)");
    expect(n[6]!.pt.toString()).toBe("(0, -2)");
    expect(n[7]!.pt.toString()).toBe("(0, 1)");
  });
  it("Coordinates", () => {
    //    0  1  2  3
    // -1       2--3
    //             |
    //  0 0--------1
    const expr = compile("_(x3); -|#2");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { nodes } = agent;
    expect(nodes[0]!.subChain).toBe(nodes[2]!.subChain);
    expect(nodes.map((it) => it.pt.toString())).toEqual([
      "(0, 0)",
      "(3, 0)",
      "(2, -1)",
      "(3, -1)",
    ]);
  });
});
