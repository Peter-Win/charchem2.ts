import { compile } from "../../../compiler/compile";
import { prepareNodes } from "../prepareNodes";
import { createTestImgProps, createTestSurface } from "../../tests/testEnv";
import { PAgentCtx } from "../PAgentCtx";
import { calcOffset, getClusterConnection, mergeClusters } from "../Clusters";
import { Point } from "../../../math/Point";

describe("getClusterConnection", () => {
  //  0 ---O 1
  //       |
  //     2 O---H 3
  const expr = compile("--O|O--H");
  expect(expr.getMessage()).toBe("");
  const agent = expr.getAgents()[0]!;
  const surface = createTestSurface();
  const imgProps = createTestImgProps(surface, 40);
  const locFont = imgProps.stdStyle.font;
  const ff = locFont.getFontFace();
  const wO = locFont.getTextWidth("O");
  const wH = locFont.getTextWidth("H");
  const k = imgProps.line;

  const ctx = new PAgentCtx(agent, imgProps);
  prepareNodes(ctx);
  const ni = ctx.nodesInfo;
  expect(ni).toHaveLength(4);
  expect(ctx.clusters.clusters).toHaveLength(1);
  const cluster = ctx.clusters.clusters[0]!;
  expect(cluster.nodes.size).toBe(4);
  expect(cluster.frame.bounds.left).toBeCloseTo(0);
  expect(cluster.frame.bounds.right).toBeCloseTo(2 * k + wH / 2);

  it("to text node, left to right", () => {
    const nodeInfo = ni[2]!;
    const res = nodeInfo.res!;
    const x = res.rcNodeCore.left + res.nodeFrame.org.x;
    expect(x).toBeCloseTo(k - wO / 2);
    const yBase = res.rcNodeCore.bottom + res.nodeFrame.org.y;
    expect(yBase).toBeCloseTo(k + ff.capHeight / 2);

    const conn = getClusterConnection(false, cluster, nodeInfo, true);
    expect(conn.x).toBe(x);
    expect(conn.yBase).toBe(yBase);
    expect(conn.yMiddle).toBeCloseTo(yBase - ff.capHeight / 2);

    const connFrm = getClusterConnection(true, cluster, nodeInfo, true);
    expect(connFrm.x).toBe(cluster.frame.bounds.left);
    expect(connFrm.yBase).toBe(conn.yBase);
    expect(connFrm.yMiddle).toBe(conn.yMiddle);
  });

  it("to text node, right to left", () => {
    const nodeInfo = ni[1]!;
    const res = nodeInfo.res!;
    const x = res.rcNodeCore.right + res.nodeFrame.org.x;
    expect(x).toBeCloseTo(k + wO / 2);
    const yBase = res.rcNodeCore.bottom + res.nodeFrame.org.y;
    expect(yBase).toBeCloseTo(ff.capHeight / 2);

    const conn = getClusterConnection(false, cluster, nodeInfo, false);
    expect(conn.x).toBe(x);
    expect(conn.yBase).toBe(yBase);
    expect(conn.yMiddle).toBeCloseTo(yBase - ff.capHeight / 2);

    const connFrm = getClusterConnection(true, cluster, nodeInfo, false);
    expect(connFrm.x).toBe(cluster.frame.bounds.right);
    expect(connFrm.yBase).toBe(conn.yBase);
    expect(connFrm.yMiddle).toBeCloseTo(conn.yMiddle);
  });

  it("to auto node", () => {
    const nodeInfo = ni[0]!;
    const connL = getClusterConnection(false, cluster, nodeInfo, true);
    expect(connL.x).toBe(0);
    expect(connL.yMiddle).toBe(0);
    expect(connL.yBase).toBeUndefined();
    const connR = getClusterConnection(false, cluster, nodeInfo, false);
    expect(connR).toEqual(connL);
    const connLF = getClusterConnection(true, cluster, nodeInfo, true);
    expect(connLF.x).toBe(cluster.frame.bounds.left);
    expect(connLF.yMiddle).toBe(connL.yMiddle);
    expect(connLF.yBase).toBeUndefined();
    const connRF = getClusterConnection(true, cluster, nodeInfo, false);
    expect(connRF.x).toBe(cluster.frame.bounds.right);
    expect(connRF.yMiddle).toBe(connR.yMiddle);
    expect(connRF.yBase).toBeUndefined();
  });
});

xdescribe("mergeClusters", () => {
  it("left to right", () => {
    const expr = compile("H-OH");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const locFont = imgProps.stdStyle.font;
    const wO = locFont.getTextWidth("O");
    const wH = locFont.getTextWidth("H");

    const ctx = new PAgentCtx(agent, imgProps);
    prepareNodes(ctx);
    const ni = ctx.nodesInfo;
    const c1 = ctx.clusters.clusters[0]!;
    expect(ctx.clusters.clusters).toHaveLength(2);
    const r1 = ni[0]!.res!.nodeFrame.getRelativeBounds();
    expect(r1.left).toBeCloseTo(-wH / 2);
    expect(r1.right).toBeCloseTo(wH / 2);
    expect(ni[1]!.res!.nodeFrame.bounds.left).toBe(0);
    expect(ni[1]!.res!.nodeFrame.bounds.right).toBeCloseTo(wH + wO);
    expect(Array.from(c1.nodes)).toEqual([0]);

    const connA = getClusterConnection(
      false,
      ctx.clusters.clusters[0]!,
      ctx.nodesInfo[0]!,
      false
    );
    const connB = getClusterConnection(
      false,
      ctx.clusters.clusters[1]!,
      ctx.nodesInfo[1]!,
      true
    );
    expect(connA.x).toBeCloseTo(wH / 2);
    expect(connB.x).toBeCloseTo(-wO / 2);
    const offset = calcOffset(connA, connB, new Point(10, 0));

    mergeClusters(c1, ctx.clusters.clusters[1]!, offset);
    expect(Array.from(c1.nodes)).toEqual([0, 1]);
    expect(c1.frame.figures).toHaveLength(2);
    expect(
      c1.frame.figures[1]!.getRelativeBounds().left -
        c1.frame.figures[0]!.getRelativeBounds().right
    ).toBeCloseTo(10);
  });
  it("right to left", () => {
    const expr = compile("H`-HO");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const locFont = imgProps.stdStyle.font;
    const wO = locFont.getTextWidth("O");
    const wH = locFont.getTextWidth("H");

    const ctx = new PAgentCtx(agent, imgProps);
    prepareNodes(ctx);
    const ni = ctx.nodesInfo;
    const c1 = ctx.clusters.clusters[0]!;
    expect(ctx.clusters.clusters).toHaveLength(2);
    const r1 = ni[0]!.res!.nodeFrame.getRelativeBounds();
    expect(r1.left).toBeCloseTo(-wH / 2);
    expect(r1.right).toBeCloseTo(wH / 2);
    const r2 = ni[1]!.res!.nodeFrame.getRelativeBounds();
    expect(r2.left).toBeCloseTo(-wO / 2 - wH);
    expect(r2.right).toBeCloseTo(wO / 2);

    const connA = getClusterConnection(
      false,
      ctx.clusters.clusters[0]!,
      ctx.nodesInfo[0]!,
      true
    );
    const connB = getClusterConnection(
      false,
      ctx.clusters.clusters[1]!,
      ctx.nodesInfo[1]!,
      false
    );
    expect(connA.x).toBeCloseTo(-wH / 2);
    expect(connB.x).toBeCloseTo(wO / 2);
    const offset = calcOffset(connA, connB, new Point(-20, 0));

    mergeClusters(c1, ctx.clusters.clusters[1]!, offset);
    expect(Array.from(c1.nodes)).toEqual([0, 1]);
    expect(c1.frame.figures).toHaveLength(2);
    expect(
      c1.frame.figures[0]!.getRelativeBounds().left -
        c1.frame.figures[1]!.getRelativeBounds().right
    ).toBeCloseTo(20);
  });
});
