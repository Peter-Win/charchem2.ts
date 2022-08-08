import { getNodeCenterPos } from "../../NodeInfo";
import { compile } from "../../../compiler/compile";
import { createTestImgProps, createTestSurface } from "../../tests/testEnv";
import { buildAgentPrior, ResultBuildAgent } from "../buildAgentPrior";
import {
  calcExplicitCenter,
  findDefaultY,
  findExplicitlyCentred,
} from "../findAgentCenter";

const build = (formula: string): ResultBuildAgent => {
  const expr = compile(formula);
  expect(expr.getMessage()).toBe("");
  const agent = expr.getAgents()[0]!;
  const surface = createTestSurface();
  const imgProps = createTestImgProps(surface, 40);
  return buildAgentPrior(agent, imgProps);
};

describe("calcExplicitCenter", () => {
  it("have no one explicit node", () => {
    const { ctx } = build("H-C<||O>-H");
    const exNodes = findExplicitlyCentred(ctx.nodesInfo);
    expect(exNodes.length).toBe(0);
    expect(calcExplicitCenter(exNodes)).toBeUndefined();
  });
  it("one", () => {
    const { ctx } = build("H-C<||$C()O>-H");
    expect(ctx.agent.nodes.map((n) => n.bCenter)).toEqual([
      false,
      false,
      true,
      false,
    ]);
    const exNodes = findExplicitlyCentred(ctx.nodesInfo);
    expect(exNodes.length).toBe(1);
    expect(exNodes[0]!.node.index).toBe(2);
    expect(String(calcExplicitCenter(exNodes))).toBe(
      String(getNodeCenterPos(exNodes[0]!))
    );
  });
  it("two", () => {
    // 0 H2N*
    //     |
    // 1   CH2  <--calculated middle
    //     |
    // 2  *COOH
    const { ctx, center } = build("$C()H2N|CH2|$C()COOH");
    expect(ctx.agent.nodes.map((n) => n.bCenter)).toEqual([true, false, true]);
    const exNodes = findExplicitlyCentred(ctx.nodesInfo);
    expect(exNodes.length).toBe(2);
    expect(exNodes[0]!.node.index).toBe(0);
    expect(exNodes[1]!.node.index).toBe(2);
    const cc = calcExplicitCenter(exNodes);
    expect(String(cc)).toBe(String(getNodeCenterPos(ctx.nodesInfo[1]!)));
    expect(String(cc)).toBe(String(center));
  });
});

describe("findDefaultY", () => {
  it("single node", () => {
    const { ctx, center } = build("HNO3");
    expect(ctx.nodesInfo.length).toBe(1);
    const ni1 = ctx.nodesInfo[0]!;
    const center1 = getNodeCenterPos(ni1);
    const y = findDefaultY(ctx.nodesInfo);
    expect(y).toBe(center1.y);
    expect(center.y).toBe(center1.y);
  });
  it("Two nodes with different y", () => {
    const { ctx } = build("CH3|OH");
    expect(ctx.nodesInfo.length).toBe(2);
    const ni1 = ctx.nodesInfo[0]!;
    const ni2 = ctx.nodesInfo[1]!;
    const center1 = getNodeCenterPos(ni1);
    const center2 = getNodeCenterPos(ni2);
    expect(findDefaultY(ctx.nodesInfo)).toBeCloseTo(
      (center1.y + center2.y) / 2
    );
  });
  it("Priority of two nodes at the same level", () => {
    //   H #0
    //   O #1
    // H2C - COOH
    //  #2   #3
    const { ctx } = build("H|O|H2C-COOH");
    expect(ctx.nodesInfo.length).toBe(4);
    const center2 = getNodeCenterPos(ctx.nodesInfo[2]!);
    const center3 = getNodeCenterPos(ctx.nodesInfo[3]!);
    expect(center2.y).toBeCloseTo(center3.y);
    expect(findDefaultY(ctx.nodesInfo)).toBeCloseTo(center2.y);
  });
  it("Two levels with the same weight", () => {
    //     1
    //  0     2
    //  6     3
    //     4
    //     5
    const { ctx } = build("/\\|`/<|>`\\`|");
    expect(ctx.nodesInfo.length).toBe(7);
    const center2 = getNodeCenterPos(ctx.nodesInfo[2]!);
    const center3 = getNodeCenterPos(ctx.nodesInfo[3]!);
    const y = findDefaultY(ctx.nodesInfo);
    expect(y).toBeCloseTo((center2.y + center3.y) / 2);
  });
  it("H2SO4", () => {
    //  0 H--O 1  O 3
    //        \  //
    //          S 2
    //        /  \\
    //  6 H--O 5  O 4
    const { ctx, center } = build("$slope(45)H-O\\S/O`/\\O`\\`/O`-H");
    expect(ctx.nodesInfo.length).toBe(7);
    const center2 = getNodeCenterPos(ctx.nodesInfo[2]!);
    const y = findDefaultY(ctx.nodesInfo);
    expect(y).toBeCloseTo(center2.y);
    expect(y).toBeCloseTo(center.y);
  });
});
