import { ChemNode } from "../../core/ChemNode";
import { getItemForced } from "../../utils/getItemForced";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { getNodeCenterPos, getNodeInfo, NodeInfo } from "../NodeInfo";
import { Point } from "../../math/Point";
import { PAgentCtx } from "./PAgentCtx";
import { Rect } from "../../math/Rect";
import { addAllSet } from "../../utils/addAllSet";

export interface Cluster {
  frame: FigFrame;
  nodes: Set<number>;
  contentRect?: Rect;
}

export const insertToCluster = (
  cluster: Cluster,
  node: ChemNode,
  nodesInfo: NodeInfo[]
) => {
  const { frame, nodes } = cluster;
  nodes.add(node.index);
  const { res } = getNodeInfo(node, nodesInfo);
  frame.addFigure(res.nodeFrame, true);
};

interface ClusterConnection {
  x: number;
  yMiddle: number;
  yBase?: number;
}

const getClusterBoxConnection = (
  cluster: Cluster,
  isLeft: boolean
): ClusterConnection => {
  const { bounds } = cluster.frame;
  return {
    x: isLeft ? bounds.left : bounds.right,
    yMiddle: (bounds.top + bounds.bottom) / 2,
  };
};

export const getClusterConnection = (
  allBox: boolean,
  cluster: Cluster,
  nodeInfo: NodeInfo,
  isLeft: boolean
): ClusterConnection => {
  const { res } = nodeInfo;
  let rcNode: Rect | undefined;
  let x: number | undefined;
  let yBase: number | undefined;
  let yMiddle;
  const { nodeFrame, rcNodeCore } = res;
  if (rcNodeCore.isEmpty()) {
    yMiddle = nodeFrame.org.y;
  } else {
    rcNode = rcNodeCore.clone();
    // Верхняя и нижняя границы идут от внутренней рамки
    // Левая и правая границы идут от фрейма узла, т.к. индексы и заряды не входят в rcNodeCore
    rcNode.A.x = nodeFrame.bounds.left;
    rcNode.B.x = nodeFrame.bounds.right;
    rcNode.move(nodeFrame.org);
    yBase = rcNode.bottom;
    yMiddle = yBase - rcNode.height / 2;
    x = isLeft ? rcNode.left : rcNode.right;
  }

  if (allBox) {
    const { bounds } = cluster.frame;
    x = isLeft ? bounds.left : bounds.right;
  } else if (x === undefined) {
    x = getNodeCenterPos(nodeInfo).x;
  }
  return { x, yMiddle, yBase };
};

export const calcOffset = (
  srcConn: ClusterConnection,
  dstConn: ClusterConnection,
  step: Point
) =>
  new Point(
    srcConn.x - dstConn.x + step.x,
    srcConn.yMiddle - dstConn.yMiddle + step.y
  );

export const calcOffsetAbs = (c0: Cluster, c1: Cluster, step: Point): Point =>
  new Point(c0.frame.bounds.right - c1.frame.bounds.left + step.x, step.y);

export const mergeClusters = (
  srcCluster: Cluster,
  dstCluster: Cluster,
  offset: Point
): void => {
  addAllSet(srcCluster.nodes, dstCluster.nodes);
  dstCluster.frame.figures.forEach((fig) => {
    fig.org.iadd(offset);
    srcCluster.frame.addFigure(fig, true);
  });
};

interface Connector {
  node: ChemNode;
  allBox: boolean;
}

interface FindResult {
  clusterIndex: number;
  cluster: Cluster;
}

export class Clusters {
  clusters: Cluster[] = [];

  init(nodes: ChemNode[], nodesInfo: NodeInfo[]) {
    const dict: Record<number, Cluster> = {};
    nodes.forEach((node) => {
      const cluster = getItemForced(dict, node.subChain, () => ({
        frame: new FigFrame(),
        nodes: new Set<number>(),
      }));
      insertToCluster(cluster, node, nodesInfo);
    });
    this.clusters = Object.values(dict);
  }

  findByIndex(nodeIndex: number): FindResult {
    const clusterIndex = this.clusters.findIndex((cl) =>
      cl.nodes.has(nodeIndex)
    );
    if (clusterIndex < 0)
      throw new Error(`Not found node with index ${nodeIndex}`);
    const cluster = this.clusters[clusterIndex]!;
    return { clusterIndex, cluster };
  }

  findByNode(node: ChemNode): FindResult {
    return this.findByIndex(node.index);
  }

  unite(
    ctx: PAgentCtx,
    src: Connector,
    dst: Connector,
    step: Point,
    bAbs?: boolean
  ) {
    const { cluster: srcCluster } = this.findByNode(src.node);
    if (!dst.node) {
      // Вообще такого быть не должно. Но если рисовать некорректно откомпилированную формулу, то бывает.
      // Было бы неплохо придумать более удачный способ обработки некорректных ситуаций.
      return {
        cluster: srcCluster,
        srcConn: { x: 0, yMiddle: 0 } as ClusterConnection,
        dstConn: { x: 0, yMiddle: 0 } as ClusterConnection,
        offset: Point.zero,
      };
    }
    const srcNodeInfo = getNodeInfo(src.node, ctx.nodesInfo);
    const { cluster: dstCluster, clusterIndex: dstPos } = this.findByNode(
      dst.node
    );
    const dstNodeInfo = getNodeInfo(dst.node, ctx.nodesInfo);
    const leftToRight = step.x >= 0;
    let offset: Point;
    const srcConn = getClusterConnection(
      src.allBox,
      srcCluster,
      srcNodeInfo,
      !leftToRight
    );
    const dstConn = getClusterConnection(
      dst.allBox,
      dstCluster,
      dstNodeInfo,
      leftToRight
    );
    if (bAbs) {
      offset = calcOffsetAbs(srcCluster, dstCluster, step);
    } else {
      offset = calcOffset(srcConn, dstConn, step);
    }
    mergeClusters(srcCluster, dstCluster, offset);
    this.clusters.splice(dstPos, 1);
    return { cluster: srcCluster, srcConn, dstConn, offset };
  }

  uniteRest(ctx: PAgentCtx) {
    const { clusters } = this;
    while (clusters.length > 1) {
      const c0 = clusters[0]!;
      const c1 = clusters[1]!;
      const offset = calcOffset(
        getClusterBoxConnection(c0, false),
        getClusterBoxConnection(c1, true),
        new Point(ctx.props.horizLine, 0)
      );
      mergeClusters(c0, c1, offset);
      clusters.splice(1, 1);
    }
  }
}
