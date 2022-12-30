import { compile } from "../compile";
import { getSrcItemsForObject } from "./getSrcItemsForObject";

describe("agentSrcMap", () => {
  it("default", () => {
    const src = "H2  +  O2 = H2O";
    const p1 = src.indexOf("O2");
    const p2 = src.indexOf("H2O");
    const expr = compile(src, { srcMap: true });
    const agents = expr.getAgents();
    expect(agents.length).toBe(3);
    expect(expr.srcMap).toBeDefined();
    expect(getSrcItemsForObject(agents[0]!, expr.srcMap)).toEqual([
      {
        begin: 0,
        end: 2,
        obj: agents[0],
      },
    ]);
    expect(getSrcItemsForObject(agents[1]!, expr.srcMap)).toEqual([
      {
        begin: p1,
        end: p1 + 2,
        obj: agents[1],
      },
    ]);
    expect(getSrcItemsForObject(agents[2]!, expr.srcMap)).toEqual([
      {
        begin: p2,
        end: p2 + 3,
        obj: agents[2],
      },
    ]);
  });
  it("with comment", () => {
    //                     11111111
    //           012345678901234567
    const src = `"A"B"C" + "pre"H2`;
    const expr = compile(src, { srcMap: true });
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    const srcMap = expr.srcMap!;
    expect(srcMap).toBeDefined();
    const d = getSrcItemsForObject(agent, srcMap)!;
    expect(d).toBeDefined();
    expect(d).toHaveLength(1);
    expect(d[0]!.begin).toBe(0);
    expect(d[0]!.end).toBe(7);

    const agent1 = expr.getAgents()[1]!;
    expect(agent1).toBeDefined();
    const d1 = getSrcItemsForObject(agent1, srcMap)!;
    expect(d1).toBeDefined();
    expect(d1).toHaveLength(1);
    expect(d1[0]!.begin).toBe(10);
    expect(d1[0]!.end).toBe(17);
  });
  it("agent with internal spaces", () => {
    //                     1         2
    //           012345678901234567890123
    const src = "H-C-C-H; H|#2|H; H|#3|H";
    const expr = compile(src, { srcMap: true });
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    const d = getSrcItemsForObject(agent, expr.srcMap);
    expect(d.length).toBe(1);
    expect(d[0]!.begin).toBe(0);
    expect(d[0]!.end).toBe(23);
  });
});
