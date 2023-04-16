import { ChemBond } from "../../core/ChemBond";
import { Int } from "../../types";
import { DraftGraph } from "../DraftGraph";
import { ChemError } from "../../core/ChemError";

export const linkDraftVertices = (
  dstGraph: DraftGraph,
  bond: ChemBond,
  nodesMap: Record<Int, DraftGraph>
) => {
  const { n, w0, w1 } = bond;
  const graphs: (DraftGraph | undefined)[] = bond.nodes.map(
    (node) => node && nodesMap[node.index]
  );
  if (graphs.length === 2) {
    const [g0, g1] = graphs;
    if (g0 && g1) {
      const c0 = g0.getConnections();
      const c1 = g1.getConnections();
      const v0 = c0[0];
      const v1 = c1[0];
      if (c0.length === 1 && c1.length === 1 && v0 && v1) {
        if (
          typeof v0.reserved === "number" &&
          Math.abs(v0.reserved) >= n &&
          typeof v1.reserved === "number" &&
          Math.abs(v1.reserved) >= n
        ) {
          v0.reserved -= n;
          v1.reserved -= n;
          const commonCharge = Math.min(
            Math.abs(v0.charge ?? 0),
            Math.abs(v1.charge ?? 0)
          );
          if (commonCharge) {
            // H^+/0S^2-\0H^+   H3O^+/0OH^-
            //      val res ch       val res ch
            // H^+   1   1  +1  H3O^+ 2      +1
            // S^2-  2   2  -2
            // H^+   1   1  +1
            v0.reserved -= commonCharge; // * Math.sign(v0.charge ?? 0);
            v1.reserved -= commonCharge; // * Math.sign(v1.charge ?? 0);
          }
          let chiralDir: -1 | 0 | 1 = 0;
          if (w0 < w1) chiralDir = 1;
          else if (w0 > w1) chiralDir = -1;
          dstGraph.edges.push({ v0, v1, mul: n, chiralDir });
        }
      }
    }
  } else {
    throw new ChemError("Too complex bond");
  }
};
