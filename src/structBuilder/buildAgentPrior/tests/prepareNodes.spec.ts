import { createTestImgProps, createTestSurface } from "../../tests/testEnv";
import { compile } from "../../../compiler/compile";
import { PAgentCtx } from "../PAgentCtx";
import { prepareNodes } from "../prepareNodes";
import { Clusters } from "../Clusters";

const getClusterNodeInices = (clusters: Clusters, id: number): number[] => {
  const nodes = clusters.clusters[id]?.nodes;
  return nodes ? Array.from(nodes) : [];
};

describe("prepareNodes", () => {
  it("Formula with 3 subchains and single chain", () => {
    //      H#3
    //      |
    // F -- C -- OH
    // #0 : |#1: #2
    //    : H#4:
    //  1 : 2  : 3 - subchains

    const expr = compile("F-C=OH; H|#2|H");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);

    const ctx = new PAgentCtx(agent, imgProps);
    expect(ctx.nodesInfo).toHaveLength(0);
    expect(ctx.clusters.clusters).toEqual([]);

    prepareNodes(ctx);

    expect(ctx.nodesInfo).toHaveLength(agent.nodes.length);
    expect(getClusterNodeInices(ctx.clusters, 0)).toEqual([0]);
    expect(getClusterNodeInices(ctx.clusters, 1)).toEqual([1, 3, 4]);
    expect(getClusterNodeInices(ctx.clusters, 2)).toEqual([2]);
  });
});
