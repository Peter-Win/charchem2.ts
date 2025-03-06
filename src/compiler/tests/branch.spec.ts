import { compile } from "../compile";
import { textFormula } from "../../textBuilder/textFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";

describe("Branch", () => {
  it("Simple", () => {
    // a---b---d
    //     |
    //     c
    const expr = compile("-<|>-");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(makeBrutto(expr), "text")).toBe("C4H10");
    const { nodes } = expr.getAgents()[0]!;
    expect(nodes).toHaveLength(4);
    const [a, b, c, d] = nodes;
    expect(a!.pt.toString()).toBe("(0, 0)");
    expect(b!.pt.toString()).toBe("(1, 0)");
    expect(c!.pt.toString()).toBe("(1, 1)");
    expect(d!.pt.toString()).toBe("(2, 0)");
  });
  it("NotAutoNode", () => {
    const expr = compile("H3C--N<|CH3>--CH3");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(makeBrutto(expr), "text")).toBe("C3H9N");
    const { nodes } = expr.getAgents()[0]!;
    expect(nodes).toHaveLength(4);
    const [a, b, c, d] = nodes;
    expect(a!.pt.toString()).toBe("(0, 0)");
    expect(b!.pt.toString()).toBe("(1, 0)");
    expect(c!.pt.toString()).toBe("(1, 1)");
    expect(d!.pt.toString()).toBe("(2, 0)");
  });
  it("Nested", () => {
    // N,N-Dimethylisopropylamine
    // ---N---
    //    |
    // ---+---
    const expr = compile("--N<|<`->->--");
    expect(expr.getMessage()).toBe("");
    const n = expr.getAgents()[0]!.nodes;
    expect(n).toHaveLength(6);
    expect(n[0]!.pt.toString()).toBe("(0, 0)");
    expect(n[1]!.pt.toString()).toBe("(1, 0)");
    expect(n[2]!.pt.toString()).toBe("(1, 1)");
    expect(n[3]!.pt.toString()).toBe("(0, 1)");
    expect(n[4]!.pt.toString()).toBe("(2, 1)");
    expect(n[5]!.pt.toString()).toBe("(2, 0)");
  });
  it("SubChainInBranch", () => {
    // 2-Pentanol         Nodes         SubChain
    // H3C-+---           0--1--5       1--1--1
    //     |                 |             |
    //     +-CH2-CH3         2--3~~4       1--1--2
    const expr = compile("H3C-<|-CH2-CH3>-");
    expect(expr.getMessage()).toBe("");
    const n = expr.getAgents()[0]!.nodes;
    expect(n).toHaveLength(6);
    expect(n[0]!.subChain).toBe(n[1]!.subChain);
    expect(n[1]!.subChain).toBe(n[2]!.subChain);
    expect(n[2]!.subChain).toBe(n[3]!.subChain);
    expect(n[3]!.subChain).toBeLessThan(n[4]!.subChain);
    expect(n[1]!.subChain).toBe(n[5]!.subChain);
    expect(n[0]!.pt.toString()).toBe("(0, 0)");
    expect(n[1]!.pt.toString()).toBe("(1, 0)");
    expect(n[2]!.pt.toString()).toBe("(1, 1)");
    expect(n[3]!.pt.toString()).toBe("(2, 1)");
    expect(n[4]!.pt.toString()).toBe("(0, 0)");
    expect(n[5]!.pt.toString()).toBe("(2, 0)");
  });
  it("NotClosed", () => {
    const expr = compile("</<\\ + H2O");
    expect(expr.getMessage("ru")).toBe(
      "Необходимо закрыть ветку, открытую в позиции 3"
    );
  });
  it("NotOpened", () => {
    const expr = compile("/>");
    expect(expr.getMessage("ru")).toBe(
      "Нельзя закрыть ветку в позиции 2, которая не открыта"
    );
  });
  it("AlternativeSyntax", () => {
    // a---b---d
    //     |
    //     c
    const expr = compile("-(*|OH*)-");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(makeBrutto(expr), "text")).toBe("C3H8O");
    const { nodes } = expr.getAgents()[0]!;
    expect(nodes).toHaveLength(4);
    const [a, b, c, d] = nodes;
    expect(a!.pt.toString()).toBe("(0, 0)");
    expect(b!.pt.toString()).toBe("(1, 0)");
    expect(c!.pt.toString()).toBe("(1, 1)");
    expect(d!.pt.toString()).toBe("(2, 0)");
  });
});
