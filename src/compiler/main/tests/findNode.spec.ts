import { makeTextFormula } from "../../../inspectors/makeTextFormula";
import { createTestCompilerWithSingleAgent } from "../../createTestCompilerWithSingleAgent";
import { findNode } from "../findNode";

describe("findNode", () => {
  it("findByIndex", () => {
    const compiler = createTestCompilerWithSingleAgent("CH3-CH2-OH");
    const agent = compiler.curAgent;
    expect(agent).toBeDefined();
    const n1 = findNode(compiler, "1");
    expect(n1).toBeDefined();
    expect(makeTextFormula(n1!)).toBe("CH3");
    const n3 = findNode(compiler, "3");
    expect(n3).toBeDefined();
    expect(makeTextFormula(n3!)).toBe("OH");
    expect(findNode(compiler, "0")).toBeUndefined();
    expect(findNode(compiler, "4")).toBeUndefined();
    const neg2 = findNode(compiler, "-2");
    expect(neg2).toBeDefined();
    expect(makeTextFormula(neg2!)).toBe("CH2");
    const neg1 = findNode(compiler, "-1");
    expect(neg1).toBeDefined();
    expect(makeTextFormula(neg1!)).toBe("OH");
  });
  it("Find By Label", () => {
    const compiler = createTestCompilerWithSingleAgent("Cl-CH2:a-CH2:b-Cl");
    const { nodes } = compiler.expr.getAgents()[0]!;
    const nCl = findNode(compiler, "Cl");
    expect(nCl).toBeDefined();
    expect(nodes[0]!).toBe(nCl);
    expect(findNode(compiler, "a")).toBe(nodes[1]);
    expect(findNode(compiler, "b")).toBe(nodes[2]);
  });
});
