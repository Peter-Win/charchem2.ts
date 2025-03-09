import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { removeHydrogen } from "../removeHydrogens";
import { makeChemGraph } from "../makeChemGraph";
import { traceGraph, WithStep } from "../traceGraph";
import { buildSpanningTree, SpanningTreeNode } from "../buildSpanningTree";
import { textFormula } from "../../textBuilder/textFormula";
import { findFarVertex } from "../findFarVertex";
import { ChemSubObj } from "../../core/ChemSubObj";
import { Int } from "../../types";

const branchText = (branch: SpanningTreeNode[]): string =>
  branch
    .map((node) => {
      let result = textFormula(node.vertex.content, "text");
      node.branches.forEach((b) => {
        result += `(${branchText(b)})`;
      });
      return result;
    })
    .join("");

describe("buildSpanningTree", () => {
  it("without cycles", () => {
    //           4   5
    //      5(5) - 4 - 6(5)
    //             |3
    //     1       3       9(5)
    //   /0  \1  /2  \6  /8  \9
    //  0      2       7(4)   10(6)
    //                 |7
    //                 8(5)
    const expr = compile("/\\/<`|<`\\>/>\\<|>/\\");
    expect(expr.getMessage()).toBe("");
    const draftH = makeGraphFromAgent(expr.getAgents()[0]!);
    expect(draftH.getElemList().sortByHill().toString()).toBe("C11H24");
    const draft = removeHydrogen(draftH);
    const g = makeChemGraph<WithStep>(draft, { step: 0 }, {});
    traceGraph(g);
    const v10 = g.vertices[10]!;
    expect(v10.step).toBe(6);
    const tree = buildSpanningTree(g);
    expect(tree.closures.length).toBe(0);

    expect(tree.vertices.length).toBe(11);
    expect(tree.closures.length).toBe(0);
    expect(tree.trunk.length).toBe(7);

    expect(tree.trunk[0]!.vertex.index).toBe(0);
    expect(tree.trunk[0]!.edge?.index).toBeUndefined();
    expect(tree.trunk[0]!.branches.length).toBe(0);

    expect(tree.trunk[1]!.vertex.index).toBe(1);
    expect(tree.trunk[1]!.edge?.index).toBe(0);
    expect(tree.trunk[1]!.branches.length).toBe(0);

    expect(tree.trunk[3]!.vertex.index).toBe(3);
    expect(tree.trunk[3]!.edge?.index).toBe(2);
    expect(tree.trunk[3]!.branches.length).toBe(1);

    expect(tree.trunk[4]!.vertex.index).toBe(7);
    expect(tree.trunk[4]!.edge?.index).toBe(6);
    expect(tree.trunk[4]!.branches.length).toBe(1);
    expect(tree.trunk[4]!.branches[0]!.length).toBe(1);
    expect(tree.trunk[4]!.branches[0]![0]!.vertex.index).toBe(8);
    expect(tree.trunk[4]!.branches[0]![0]!.edge?.index).toBe(7);

    expect(tree.trunk[3]!.branches.length).toBe(1);
    expect(
      tree.trunk[3]!.branches[0]!.map(({ vertex }) => vertex.index)
    ).toEqual([4, 6]);
    expect(tree.trunk[3]!.branches[0]!.map(({ edge }) => edge?.index)).toEqual([
      3, 5,
    ]);

    expect(tree.trunk[3]!.branches[0]![0]!.branches.length).toBe(1);

    expect(branchText(tree.trunk)).toBe("CCCC(C(C)C)C(C)CC");
  });

  it("simple cycle", () => {
    //  index    step
    //  0 -- 1   0 -- 1
    //  |    |   |    |
    //  3 -- 2   1 -- 2
    const expr = compile("-|`-`|");
    expect(expr.getMessage()).toBe("");
    const draftH = makeGraphFromAgent(expr.getAgents()[0]!);
    const draft = removeHydrogen(draftH);
    const g = makeChemGraph<WithStep>(draft, { step: 0 }, {});
    traceGraph(g);
    expect(g.vertices.map(({ step }) => step)).toEqual([0, 1, 2, 1]);
    const tree = buildSpanningTree(g);
    expect(tree.closures.length).toBe(1);
    const c = tree.closures[0]!;
    expect(`${c.v0}-${c.v1}`).toBe("2-3");
    expect(tree.trunk.length).toBe(3);
    expect(tree.trunk.map(({ vertex }) => vertex.index)).toEqual([0, 1, 2]);
    expect(tree.trunk[0]!.branches.length).toBe(1);
    expect(branchText(tree.trunk)).toBe("C(C)CC");
  });

  it("multi cycles", () => {
    //  index              step            closures
    //     5     6            1*    3*        C     C
    //  0     4     7(S)   0*    2*    4*  C     C1    S
    //  1     3     8      1%    3%    5*  C     C1    C2
    //     2(N)  9(B)         2%    4%        N     B2
    //     12    10           3#    5%        C     C3
    //       11(O)               4#              O3
    const expr = compile("|\\N/`|<`\\`/>/\\S|`/B<`\\>|`/O`\\`|");
    expect(expr.getMessage()).toBe("");
    const draftH = makeGraphFromAgent(expr.getAgents()[0]!);
    const draft = removeHydrogen(draftH);
    const g = makeChemGraph<WithStep>(draft, { step: 0 }, {});
    traceGraph(g);
    expect(g.vertices.map(({ step }) => step)).toEqual([
      0, 1, 2, 3, 2, 1, 3, 4, 5, 4, 5, 4, 3,
    ]);
    const fv = findFarVertex(g.vertices);
    expect(fv?.step).toBe(5);
    expect(fv?.index).toBe(10);

    const t = buildSpanningTree(g);
    expect(t.trunk.map(({ vertex }) => vertex.index)).toEqual([
      0, 1, 2, 3, 9, 10,
    ]);
    expect(branchText(t.trunk)).toBe("C(CCCSC)CN(CO)CBC");
    expect(t.closures.map(({ v0, v1 }) => `${v0}-${v1}`)).toEqual([
      "3-4",
      "8-9",
      "10-11",
    ]);
  });

  it("propionic acid", () => {
    //      1       4
    //    /   \   /
    //  0       2
    //          ║
    //          3
    const expr = compile("/\\|O`|/OH");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes.map((n) => textFormula(n, "text"))).toEqual([
      "",
      "",
      "",
      "O",
      "OH",
    ]);
    expect(agent.bonds.map(({ n }) => n)).toEqual([1, 1, 2, 1]);
    const draft = removeHydrogen(makeGraphFromAgent(agent));
    const vxInfo = (vx: { content: ChemSubObj; hydrogen?: Int }): string =>
      textFormula(vx.content, "text") + (vx.hydrogen || 0);
    expect(draft.vertices.map(vxInfo)).toEqual(["C3", "C2", "C0", "O0", "O1"]);
    const g = makeChemGraph<WithStep>(draft, { step: 0 }, {});
    expect(g.vertices.map(vxInfo)).toEqual(["C3", "C2", "C0", "O0", "O1"]);
    traceGraph(g);
    const tree = buildSpanningTree(g);
    expect(tree.trunk.map((n) => vxInfo(n.vertex))).toEqual([
      "C3",
      "C2",
      "C0",
      "O1",
    ]);
  });
});
