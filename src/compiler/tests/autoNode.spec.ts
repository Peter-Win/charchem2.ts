import { compile } from "../compile";

describe("autoNode", () => {
  it("AutoNode", () => {
    const expr = compile("/c///");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes).toHaveLength(3);
    expect(agent.bonds.map((it) => it.linearText())).toEqual(["/", "///"]);
  });
});
