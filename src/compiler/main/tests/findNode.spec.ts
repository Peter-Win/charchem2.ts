import { textFormula } from "../../../textBuilder/textFormula";
import { createTestCompilerWithSingleAgent } from "../../createTestCompilerWithSingleAgent";
import { findNode } from "../findNode";

describe("findNode", () => {
  it("findByIndex", () => {
    const compiler = createTestCompilerWithSingleAgent("CH3-CH2-OH");
    const agent = compiler.curAgent;
    expect(agent).toBeDefined();
    const n1 = findNode(compiler, "1");
    expect(n1).toBeDefined();
    expect(textFormula(n1!, "text")).toBe("CH3");
    const n3 = findNode(compiler, "3");
    expect(n3).toBeDefined();
    expect(textFormula(n3!, "text")).toBe("OH");
    expect(findNode(compiler, "0")).toBeUndefined();
    expect(findNode(compiler, "4")).toBeUndefined();
    const neg2 = findNode(compiler, "-2");
    expect(neg2).toBeDefined();
    expect(textFormula(neg2!, "text")).toBe("CH2");
    const neg1 = findNode(compiler, "-1");
    expect(neg1).toBeDefined();
    expect(textFormula(neg1!, "text")).toBe("OH");
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
